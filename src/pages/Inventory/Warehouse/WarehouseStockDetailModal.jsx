/* eslint-disable react/prop-types */
import { Modal, Box, Typography, Divider, Grid, Avatar } from "@mui/material";

const WarehouseStockDetailModal = ({ open, onClose, stock }) => {
    if (!stock) return null;

    const { product, warehouse, quantity } = stock;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 4,
                    width: 600,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Warehouse Stock Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold">Product Information</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                            <Avatar
                                src={product?.image}
                                alt={product?.product_name}
                                variant="rounded"
                                sx={{ width: 64, height: 64 }}
                            />
                            <Box>
                                <Typography variant="body1">{product?.product_name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Code: {product?.product_code || "—"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Batch: {product?.batchNumber || "—"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Selling Price: ${product?.sellingPrice}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>


                    <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" mt={2}>Warehouse Information</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">Name: {warehouse?.name}</Typography>
                            <Typography variant="body2">City: {warehouse?.city}</Typography>
                            <Typography variant="body2">Address: {warehouse?.address}</Typography>
                            <Typography variant="body2">Phone: {warehouse?.phone}</Typography>
                            <Typography variant="body2">Manager: {warehouse?.manager}</Typography>
                            <Typography variant="body2">Type: {warehouse?.type}</Typography>
                            <Typography variant="body2">Status: {warehouse?.status}</Typography>
                        </Box>
                    </Grid>

                    {/* Stock Info */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" mt={2}>Stock Information</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">Quantity: {quantity}</Typography>
                            <Typography variant="body2">
                                Expiry Date: {product?.expiryDate || "—"}
                            </Typography>
                            <Typography variant="body2">
                                Created At: {new Date(stock.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                                Updated At: {new Date(stock.updatedAt).toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ textAlign: "right", mt: 3 }}>
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Close
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default WarehouseStockDetailModal