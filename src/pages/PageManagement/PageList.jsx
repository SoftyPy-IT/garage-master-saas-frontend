/* eslint-disable react/prop-types */

import {
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Avatar,
  alpha,
  useTheme,
  Typography,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
  Dashboard as DashboardIcon,
  Route as RouteIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  LocalOffer as TagIcon,
} from "@mui/icons-material";

const PageList = ({
  pageData,
  searchTerm,
  handleSearchChange,
  handleMenuClick,
  handleCreatePage,
}) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    return status === "active"
      ? theme.palette.success.main
      : theme.palette.error.main;
  };

  const getStatusIcon = (status) => {
    return status === "active" ? <ActiveIcon /> : <InactiveIcon />;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      Main: <DashboardIcon />,
      Operations: <RouteIcon />,
      Resources: <TagIcon />,
      Staff: <PeopleIcon />,
      Analytics: <DescriptionIcon />,
      System: <SettingsIcon />,
      Admin: <PeopleIcon />,
    };
    return iconMap[category] || <DescriptionIcon />;
  };

  return (
    <>
      <Card
        sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", mb: 4 }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search pages..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button sx={{ color: '#fff' }} onClick={handleCreatePage}>Create Page </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box sx={{ mb: 3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
              >
                <TableRow>
                  <TableCell>Page Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Path</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageData?.data?.map((page) => (
                  <TableRow key={page.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          {getCategoryIcon(page.category)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {page.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {page.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getCategoryIcon(page.category)}
                        label={page.category}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {page.path}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">

                        <Chip
                          icon={getStatusIcon(page.status)}
                          label={
                            page.status === "active" ? "Active" : "Inactive"
                          }
                          size="small"
                          sx={{
                            bgcolor: alpha(getStatusColor(page.status), 0.1),
                            color: getStatusColor(page.status),
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, page)}>
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        </Card>
      </Box>
    </>
  );
};

export default PageList;