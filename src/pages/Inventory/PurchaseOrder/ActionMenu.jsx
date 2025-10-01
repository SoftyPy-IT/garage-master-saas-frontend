/* eslint-disable react/prop-types */
import { CheckCircle, Delete, Edit, Visibility } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ActionMenu = ({
  anchorEl,
  selectedOrder,
  onMenuClose,
  onViewOrder,
  onEditOrder,
  onOpenReceiveDialog,
  onDeleteOrder,
}) => {
  const theme = useTheme();
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onMenuClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <MenuItem onClick={onViewOrder} sx={{ py: 1.5 }}>
        <Visibility
          fontSize="small"
          sx={{ mr: 1, color: theme.palette.info.main }}
        />
        View
      </MenuItem>
      <MenuItem onClick={onEditOrder} sx={{ py: 1.5 }}>
        <Edit
          fontSize="small"
          sx={{ mr: 1, color: theme.palette.warning.main }}
        />
        Edit
      </MenuItem>
      <MenuItem
        onClick={onOpenReceiveDialog}
        disabled={
          !selectedOrder ||
          selectedOrder.status === "received" ||
          selectedOrder.status === "cancelled"
        }
        sx={{ py: 1.5 }}
      >
        <CheckCircle
          fontSize="small"
          sx={{ mr: 1, color: theme.palette.success.main }}
        />
        Receive
      </MenuItem>
      <MenuItem onClick={onDeleteOrder} sx={{ py: 1.5 }}>
        <Delete
          fontSize="small"
          sx={{ mr: 1, color: theme.palette.error.main }}
        />
        Delete
      </MenuItem>
    </Menu>
  );
};

export default ActionMenu;