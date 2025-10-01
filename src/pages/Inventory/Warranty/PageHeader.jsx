/* eslint-disable react/prop-types */
import { Box, Typography, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export const PageHeader = ({ searchTerm, setSearchTerm, handleOpenModal }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 4,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #6a1b9a, #8e24aa)",
          backgroundClip: "text",
          textFillColor: "transparent",
        }}
      >
        <VerifiedUserIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Warranty Management
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ width: { xs: "100%", sm: 220 } }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            background: "linear-gradient(45deg, #6a1b9a, #8e24aa)",color:'white'
          }}
        >
          New Warranty
        </Button>
      </Box>
    </Box>
  );
};