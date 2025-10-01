/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as NoteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import CreateNoteModal from "./CreateNoteModal";
import { StyledCard } from "../../../../utils";
import { NoteDate, NoteHeader } from "../../../../utils/customStyle";
import {
  useDeleteNoteMutation,
  useGetAllNotesQuery,
} from "../../../../redux/api/noteApi";
import swal from "sweetalert";

const CustomerNote = ({ id, tenantDomain, companyId, showRoomId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingNote, setEditingNote] = useState(null);

  const limit = 10;

  const {
    data: noteData,
    isLoading,
    isError,
    refetch,
  } = useGetAllNotesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm,
    isRecycled: false,
    customerId: id, // ✅ Filtering by customer
    companyId, // ✅ Optional
    showRoomId, // ✅ Optional
  });

  const [deleteNote] = useDeleteNoteMutation();

  const notes = noteData?.data?.notes || [];
  const totalNotes = noteData?.data?.meta?.total || 0;
  const totalPages = noteData?.data?.meta?.totalPage || 1;

  const handleDeleteNote = async (noteId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to delete this note?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await deleteNote({ tenantDomain, id: noteId }).unwrap();
        refetch();
        swal("Moved to Recycle bin!", "Note deleted successfully.", "success");
      } catch (error) {
        swal("Error", "An error occurred while deleting the note.", "error");
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setOpenModal(true);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setOpenModal(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Failed to load notes. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Customer Notes ({totalNotes})
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
              sx: { borderRadius: "12px" },
            }}
            sx={{ width: 300 }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNote}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(63, 81, 181, 0.4)",
              },
            }}
          >
            Create Note
          </Button>
        </Box>
      </Box>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "background.paper",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <NoteIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
            No notes found
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            {searchTerm
              ? "Try a different search term"
              : "Create your first note"}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNote}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Create Note
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {notes.map((note) => (
              <Grid item xs={12} md={6} lg={4} key={note._id}>
                <StyledCard>
                  <Box sx={{ p: 2.5 }}>
                    <NoteHeader variant="h6">
                      <NoteIcon fontSize="small" />
                      {note.title || "Untitled Note"}
                    </NoteHeader>

                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        minHeight: "80px",
                        mb: 1.5,
                        mt: 1,
                      }}
                    >
                      {note.content}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <NoteDate variant="body2">
                          Created:{" "}
                          {format(
                            new Date(note.createdAt),
                            "MMM dd, yyyy - h:mm a"
                          )}
                        </NoteDate>
                      </Box>

                      <Box>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditNote(note)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteNote(note._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 1 }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "contained" : "outlined"}
                    onClick={() => setCurrentPage(page)}
                    sx={{ minWidth: 36 }}
                  >
                    {page}
                  </Button>
                )
              )}
            </Box>
          )}
        </>
      )}

      {/* Create/Edit Note Modal */}
      <CreateNoteModal
        tenantDomain={tenantDomain}
        id={id}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingNote(null);
          refetch();
        }}
        editingNote={editingNote}
      />

      <Divider sx={{ my: 4 }} />
    </Box>
  );
};

export default CustomerNote;
