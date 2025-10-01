/* eslint-disable react/prop-types */
import { Grid, Card, CardContent, Box, Typography, Divider, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InventoryIcon from "@mui/icons-material/Inventory";
import { alpha } from "@mui/material/styles";
import { ProductTooltip } from "./ProductTooltip";

export const WarrantyCard = ({ warranty, onEdit, onDelete }) => {
  const color = generateColor(warranty._id);
  
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 16px ${alpha(color, 0.2)}`,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -15,
            left: 20,
            width: 50,
            height: 50,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.8)})`,
          }}
        >
          <VerifiedUserIcon fontSize="medium" />
        </Box>
        <CardContent sx={{ pt: 4, flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ color: color }}>
            {warranty.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {warranty.description}
          </Typography>
          
          {/* Duration Section */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: color }} />
            <Typography variant="body2">
              {formatDuration(warranty.duration, warranty.durationType)}
            </Typography>
          </Box>
          
          {/* Products Section with Tooltip */}
          <Tooltip
            title={<ProductTooltip products={warranty.products} />}
            arrow
            placement="top"
            interactive
            enterDelay={0}
            leaveDelay={200}
          >
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                mb: 1,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  textDecorationColor: color,
                }
              }}
            >
              <InventoryIcon fontSize="small" sx={{ mr: 1, color: color }} />
              <Typography variant="body2">
                {warranty.totalProducts} product{warranty.totalProducts !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Tooltip>
          
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>
            Terms: {warranty.terms}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => onEdit(warranty)}
              sx={{ 
                color: color,
                "&:hover": {
                  backgroundColor: alpha(color, 0.1),
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(warranty._id)}
              sx={{ 
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: alpha("#d32f2f", 0.1),
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

// Utility functions
const formatDuration = (duration, type) => {
  const units = { days: "days", months: "months", years: "years" };
  return `${duration} ${units[type] || type}`;
};

const generateColor = (id) => {
  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};