import { Box, Grid, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { PageHeader } from "./PageHeader";
import { WarrantyCard } from "./WarrantyCard";
import { useWarranties } from "../../../hooks/useWarranties";
import WarrantyModal from "./WarrantyModal";

export default function WarrantiesPage() {
  const theme = useTheme();
  const {
    openModal,
    editingWarranty,
    warranties,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleOpenModal,
    handleCloseModal,
    handleEditWarranty,
    handleDeleteWarranty,
    refetch,
    tenantDomain,
  } = useWarranties();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Loading warranties...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(to right, ${alpha(
          theme.palette.primary.light,
          0.1
        )}, ${alpha(theme.palette.background.default, 0.1)})`,
        minHeight: "100vh",
        p: 1,
      }}
    >
      <BreadcrumbNavigation />
      <PageHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleOpenModal={handleOpenModal}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {warranties.data?.map((warranty) => (
          <WarrantyCard
            key={warranty._id}
            warranty={warranty}
            onEdit={handleEditWarranty}
            onDelete={handleDeleteWarranty}
          />
        ))}
      </Grid>

      <WarrantyModal
        open={openModal}
        onClose={handleCloseModal}
        editingWarranty={editingWarranty}
        refetch={refetch}
        tenantDomain={tenantDomain}
      />
    </Box>
  );
}
