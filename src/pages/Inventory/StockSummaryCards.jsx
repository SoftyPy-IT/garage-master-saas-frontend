/* eslint-disable react/prop-types */
"use client";
import { Box, Grid, Card, CardContent, Typography, Avatar, useTheme, alpha } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

export default function StockSummaryCards({ stockData = [], criticalStocks = [] }) {
    const theme = useTheme();

    const outOfStockCount = criticalStocks.filter(stock => stock.stock === 0).length;
    const totalProducts = stockData?.length || 0;

    const cards = [
        {
            title: "Critical Stock Items",
            value: criticalStocks.length,
            subtitle: "Needs Immediate Attention",
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light,
            icon: <WarningIcon fontSize="large" />,
        },
        {
            title: "Out of Stock",
            value: outOfStockCount,
            subtitle: "Zero Inventory",
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light,
            icon: <WarningIcon fontSize="large" />,
        },
        {
            title: "Total Products",
            value: totalProducts,
            subtitle: "All Inventory Items",
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light,
            icon: <WarningIcon fontSize="large" />,
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            boxShadow: `0 6px 16px ${alpha(card.color, 0.15)}`,
                            background: `linear-gradient(135deg, ${alpha(card.bgColor, 0.2)}, ${alpha(card.color, 0.05)})`,
                            border: `1px solid ${alpha(card.color, 0.1)}`,
                            transition: "transform 0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: `0 8px 20px ${alpha(card.color, 0.2)}`,
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {card.subtitle}
                                    </Typography>
                                </Box>
                                <Avatar
                                    sx={{
                                        bgcolor: alpha(card.color, 0.2),
                                        color: card.color,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    {card.icon}
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
