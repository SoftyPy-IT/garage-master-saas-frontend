/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import PageHeader from "./PageHeader";
import PageList from "./PageList";
import PageForm from "./PageForm";
import PageDetails from "./PageDetails"; // Import the new PageDetails component
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetAllPagesQuery, useDeletePageMutation } from "../../redux/api/pageApi";
import Swal from "sweetalert2";

const PageManagement = () => {
  const { tenantDomain } = useTenantDomain();
  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("view");

  const { data: pageData, isLoading, refetch } = useGetAllPagesQuery({ tenantDomain });
  const [deletePage] = useDeletePageMutation();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuClick = (event, page) => {
    setAnchorEl(event.currentTarget);
    setSelectedPage(page);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    setDialogType(action);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPage(null);
    handleMenuClose();
  };

  const handleDeletePage = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
      });

      if (result.isConfirmed) {
        await deletePage({ id, tenantDomain }).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Page has been deleted.",
          icon: "success",
          timer: 1500
        });
        handleDialogClose();
        refetch();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete page",
        icon: "error"
      });
    }
  };

  const handleCreatePage = () => {
    setDialogType("create");
    setOpenDialog(true);
  };

  const handleEditPage = () => {
    setDialogType("edit");
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <PageHeader pageData={pageData} />

      <PageList

        pageData={pageData}
        handleSearchChange={handleSearchChange}
        handleMenuClick={handleMenuClick}
        tenantDomain={tenantDomain}
        isLoading={isLoading}
        handleCreatePage={handleCreatePage}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction("view")}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditPage}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Page
        </MenuItem>
        <MenuItem onClick={() => handleDeletePage(selectedPage?._id)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete Page</Typography>
        </MenuItem>
      </Menu>


      {dialogType === "view" ? (
        <PageDetails
          open={openDialog}
          onClose={handleDialogClose}
          pageData={selectedPage}
        />
      ) : (
        <PageForm
          open={openDialog}
          onClose={handleDialogClose}
          pageData={selectedPage}
          mode={dialogType}
          tenantDomain={tenantDomain}
          refetch={refetch}
        />
      )}
    </Container>
  );
};

export default PageManagement;