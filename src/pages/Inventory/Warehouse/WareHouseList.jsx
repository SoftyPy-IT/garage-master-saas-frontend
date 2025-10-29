/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    Chip,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import Table from "@/components/Table";
import { useGetWareHouseStocksQuery } from "@/redux/api/warehouseApi";
import { useAppOptions } from "@/hooks/useAppOptions";
import Breadcrumb from "../../../components/Breadcrumb";
import WarehouseStatsCards from "./WarehouseStatsCards";
import WarehouseStockDetailModal from "./WarehouseStockDetailModal";

const WarehouseStockOverview = () => {
    const { tenantDomain } = useAppOptions();

    const { data, isLoading, refetch } = useGetWareHouseStocksQuery({ tenantDomain });
    const warehouseStocks = data?.data?.warehouseStocks || [];
    const [selectedStock, setSelectedStock] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleView = (item) => {
        setSelectedStock(item);
        setOpenModal(true);
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("all");
    const [selectedCity, setSelectedCity] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const filteredData = useMemo(() => {
        return warehouseStocks.filter((item) => {
            const warehouseMatch = selectedWarehouse === "all" || item?.warehouse?.name === selectedWarehouse;
            const cityMatch = selectedCity === "all" || item?.warehouse?.city === selectedCity;
            const statusMatch = statusFilter === "all" || item?.warehouse?.status === statusFilter;
            const searchMatch =
                item.product?.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.warehouse?.name.toLowerCase().includes(searchTerm.toLowerCase());
            return warehouseMatch && cityMatch && statusMatch && searchMatch;
        });
    }, [warehouseStocks, selectedWarehouse, selectedCity, statusFilter, searchTerm]);
    const columns = [
        { key: "index", label: "#", type: "index" },
        {
            key: "product.product_name",
            label: "Product",
            render: (item) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                        src={item.product?.image}
                        alt={item.product?.product_name}
                        variant="rounded"
                        sx={{ width: 36, height: 36 }}
                    />
                    <Typography variant="body2">{item?.product?.product_name}</Typography>
                </Box>
            ),
        },
        { key: "warehouse.name", label: "Warehouse" },
        { key: "warehouse.city", label: "City" },
        { key: "product.batch_number", label: "Batch No", render: (item) => item?.product?.batch_number || "—" },
        { key: "quantity", label: "Quantity" },
        {
            key: "warehouse.status",
            label: "Status",
            render: (item) => (
                <Chip
                    label={item?.warehouse?.status}
                    color={item?.warehouse?.status === "active" ? "success" : "default"}
                    size="small"
                />
            ),
        },
    ];


    const actions = [
        { label: "View", icon: Visibility, tooltip: "View Details", onClick: handleView },
        { label: "Edit", icon: Edit, tooltip: "Edit", onClick: (item) => console.log("Edit", item) },
        { label: "Delete", icon: Delete, tooltip: "Delete", onClick: (item) => console.log("Delete", item) },
    ];


    const totalWarehouses = new Set(warehouseStocks?.map((w) => w?.warehouse?._id)).size;
    const totalQuantity = warehouseStocks?.reduce((acc, cur) => acc + cur?.quantity, 0);
    const totalCities = new Set(warehouseStocks?.map((w) => w?.warehouse?.city)).size;

    return (
        <Box className="p-6 space-y-6">
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Inventory", href: "/inventory" },
                    { label: "Warehouse Stock Overview" },
                ]}
            />


            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Warehouse Stock Overview
            </Typography>
            <WarehouseStatsCards
                totalWarehouses={totalWarehouses}
                totalQuantity={totalQuantity}
                totalCities={totalCities}
            />
            <Box className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl border">
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        label="Warehouse"
                    >
                        <MenuItem value="all">All</MenuItem>
                        {[...new Set(warehouseStocks?.map((i) => i?.warehouse?.name))]?.map((name) => (
                            <MenuItem key={name} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>City</InputLabel>
                    <Select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        label="City"
                    >
                        <MenuItem value="all">All</MenuItem>
                        {[...new Set(warehouseStocks?.map((i) => i?.warehouse?.city))]?.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Search by product or warehouse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 240 }}
                />

                <button
                    onClick={refetch}
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Refresh
                </button>
            </Box>


            <Table
                title="Warehouse Stock Data"
                columns={columns}
                data={filteredData}
                actions={actions}
                loading={isLoading}
                emptyMessage="No warehouse stock data found."
            />
            <WarehouseStockDetailModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                stock={selectedStock}
            />

        </Box>
    );
};

export default WarehouseStockOverview;
