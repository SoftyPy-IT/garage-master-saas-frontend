/* eslint-disable react/prop-types */

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box,
    Grid,
    Chip,
    Avatar,
    Typography,
    Card,
    CardContent,
    Divider,
    useTheme,
    alpha,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
    Dashboard as DashboardIcon,
    Route as RouteIcon,
    Description as DescriptionIcon,
    Settings as SettingsIcon,
    People as PeopleIcon,
    LocalOffer as TagIcon,
    ToggleOn as ActiveIcon,
    ToggleOff as InactiveIcon,
    Link as LinkIcon,
    Category as CategoryIcon,
} from "@mui/icons-material";

const PageDetails = ({ open, onClose, pageData }) => {
    const theme = useTheme();

    if (!pageData) return null;

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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                    backdropFilter: "blur(10px)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    py: 2,
                    px: 3,
                }}
            >
                <Box display="flex" alignItems="center">
                    <Avatar
                        sx={{
                            mr: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                        }}
                    >
                        {getCategoryIcon(pageData.category)}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                        Page Details
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Page Header */}
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                overflow: "hidden",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            mr: 3,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        {getCategoryIcon(pageData.category)}
                                    </Avatar>
                                    <Box flexGrow={1}>
                                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                                            {pageData.name}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {pageData.description || "No description available"}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        icon={getStatusIcon(pageData.status)}
                                        label={pageData.status === "active" ? "Active" : "Inactive"}
                                        size="medium"
                                        sx={{
                                            bgcolor: alpha(getStatusColor(pageData.status), 0.1),
                                            color: getStatusColor(pageData.status),
                                            fontWeight: "bold",
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Page Information */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                height: "100%",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Page Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box mb={2}>
                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <CategoryIcon
                                            fontSize="small"
                                            sx={{ mr: 1, color: theme.palette.text.secondary }}
                                        />
                                        <Typography variant="body2" color="text.secondary" minWidth={80}>
                                            Category:
                                        </Typography>
                                        <Chip
                                            icon={getCategoryIcon(pageData.category)}
                                            label={pageData.category}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    </Box>

                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <LinkIcon
                                            fontSize="small"
                                            sx={{ mr: 1, color: theme.palette.text.secondary }}
                                        />
                                        <Typography variant="body2" color="text.secondary" minWidth={80}>
                                            Path:
                                        </Typography>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {pageData.path}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <RouteIcon
                                            fontSize="small"
                                            sx={{ mr: 1, color: theme.palette.text.secondary }}
                                        />
                                        <Typography variant="body2" color="text.secondary" minWidth={80}>
                                            Route:
                                        </Typography>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {pageData.route}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Additional Details */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                height: "100%",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Additional Details
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box mb={2}>
                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <Typography variant="body2" color="text.secondary" minWidth={120}>
                                            Page ID:
                                        </Typography>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {pageData._id}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <Typography variant="body2" color="text.secondary" minWidth={120}>
                                            Created At:
                                        </Typography>
                                        <Typography variant="body2">
                                            {new Date(pageData.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <Typography variant="body2" color="text.secondary" minWidth={120}>
                                            Last Updated:
                                        </Typography>
                                        <Typography variant="body2">
                                            {new Date(pageData.updatedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PageDetails;