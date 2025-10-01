/* eslint-disable react/prop-types */
// components/CreateNoteModal.jsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Description as NoteIcon } from "@mui/icons-material";
import GarageForm from "../../../../components/form/Form";
import TASInput from "../../../../components/form/Input";
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "../../../../redux/api/noteApi";
import { toast } from "react-toastify";
import { CheckIcon } from "lucide-react";

const CreateNoteModal = ({ id, open, onClose, tenantDomain, editingNote }) => {
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();

  const isEditMode = Boolean(editingNote);

  const handleSubmit = async (data) => {
    const submitData = {
      ...data,
      customerId: id,
    };

    try {
      let res;
      if (isEditMode) {
        res = await updateNote({
          id: editingNote._id,
          tenantDomain,
          ...submitData,
        }).unwrap();
      } else {
        res = await createNote({ ...submitData, tenantDomain }).unwrap();
      }

      if (res.success) {
        toast.success(res.message || (isEditMode ? "Note updated!" : "Note created!"));
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <GarageForm onSubmit={handleSubmit} defaultValues={editingNote || {}}>
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 2,
          }}
        >
          <NoteIcon fontSize="large" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEditMode ? "Edit Note" : "Create New Note"}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <TASInput
            fullWidth
            label="Note Title"
            name="title"
            margin="normal"
            variant="outlined"
            InputProps={{ sx: { borderRadius: "12px" } }}
          />

          <TASInput
            fullWidth
            multiline
            rows={4}
            label="Note Content"
            name="content"
            margin="normal"
            variant="outlined"
            InputProps={{ sx: { borderRadius: "12px" } }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: "12px", textTransform: "none", px: 3, py: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={!isCreating && !isUpdating && <CheckIcon />}
            disabled={isCreating || isUpdating}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
            }}
          >
            {isCreating || isUpdating ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditMode ? (
              "Update Note"
            ) : (
              "Create Note"
            )}
          </Button>
        </DialogActions>
      </GarageForm>
    </Dialog>
  );
};
export default CreateNoteModal;