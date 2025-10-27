/* eslint-disable react/prop-types */
import { alpha, Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { cardStyle } from "../../utils/customStyle";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ShoppingBag,
    QrCode as QrCodeIcon,
    Visibility,
} from "@mui/icons-material";
import ActionIconButton from "../../components/ActionIconButton";
import Can from "../../components/Can";
import { useFormController } from "../../hooks/useFormController";
export const ProductCard = ({ product, onEdit, onDelete }) => {
    const { theme, elevation, setElevation } = useFormController()
    return (
        <Card
            elevation={elevation}
            onMouseEnter={() => setElevation(3)}
            onMouseLeave={() => setElevation(1)}
            sx={cardStyle}
        >
            <Box
                sx={{
                    height: 140,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {product.image ? (
                    <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.product_name}
                        style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                            padding: "8px",
                        }}
                    />
                ) : (
                    <ShoppingBag sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.2) }} />
                )}

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        bgcolor: "white",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <QrCodeIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Box
                    sx={{
                        mb: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        noWrap
                        title={product.product_name}
                    >
                        {product.product_name}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Chip
                        label={product.category?.main_category || "Uncategorized"}
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            height: 20,
                        }}
                    />
                    {product.brand?.brand && (
                        <Chip
                            label={product.brand.brand}
                            size="small"
                            sx={{
                                ml: 0.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                color: "text.secondary",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                height: 20,
                            }}
                        />
                    )}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Code:{" "}
                        <Typography component="span" variant="body2" fontWeight={500}>
                            {product.product_code}
                        </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Unit:{" "}
                        <Typography component="span" variant="body2" fontWeight={500}>
                            {product.unit?.short_name || "N/A"}
                        </Typography>
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Typography variant="h6" color={theme.palette.primary.main} fontWeight={600}>
                        ৳ {product.purchasePrice}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Stock: {product.product_quantity} {product.unit?.short_name || ""}
                    </Typography>
                    <Box>
                        <ActionIconButton
                            title="Details"
                            colorVariant="primary"
                            icon={
                                <Can page="#" action="details">
                                    <Visibility fontSize="small" /> 
                                </Can>
                            }
                            // onClick={() => onEdit(product._id)}
                        />
                        <ActionIconButton
                            title="Edit"
                            colorVariant="warning"
                            icon={
                                <Can page="/dashboard/product-list" action="edit">
                                    <EditIcon fontSize="small" />
                                </Can>
                            }
                            onClick={() => onEdit(product._id)}
                        />

                        <ActionIconButton
                            title="Delete"
                            colorVariant="error"
                            icon={
                                <Can page="/dashboard/product-list" action="delete">
                                    <DeleteIcon fontSize="small" />
                                </Can>
                            }
                            onClick={() => onDelete(product._id)}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

