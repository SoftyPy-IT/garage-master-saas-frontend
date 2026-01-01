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
import { Visibility } from "@mui/icons-material";
import Table from "@/components/Table";
import { useGetWareHouseStocksQuery } from "@/redux/api/warehouseApi";
import { useAppOptions } from "@/hooks/useAppOptions";
import Breadcrumb from "../../../components/Breadcrumb";
import WarehouseStatsCards from "./WarehouseStatsCards";
import WarehouseStockDetailModal from "./WarehouseStockDetailModal";

const WarehouseStockOverview = () => {
    const { tenantDomain } = useAppOptions();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("all");
    const [selectedCity, setSelectedCity] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data, isLoading, refetch } = useGetWareHouseStocksQuery({
        tenantDomain,
    });
    const allFlattenedStocks = useMemo(() => {
        const warehouseStocks = data?.data?.warehouseStocks || [];
        return warehouseStocks.flatMap(
            (warehouseItem) =>
                warehouseItem.products?.map((productItem) => ({
                    id: `${warehouseItem._id}-${productItem._id}`,
                    product: {
                        _id: productItem._id,
                        product_name: productItem.product_name,
                        product_code: productItem.product_code,
                    },
                    quantity: productItem.quantity,
                    warehouse: warehouseItem.warehouse,
                    warehouseId: warehouseItem._id,
                    totalProducts: warehouseItem.totalProducts,
                    totalQuantity: warehouseItem.totalQuantity,
                })) || []
        );
    }, [data]);

    // Filter data
    const filteredData = useMemo(() => {
        return allFlattenedStocks.filter((item) => {
            const warehouseMatch =
                selectedWarehouse === "all" ||
                item?.warehouse?.name === selectedWarehouse;
            const cityMatch =
                selectedCity === "all" || item?.warehouse?.city === selectedCity;
            const statusMatch =
                statusFilter === "all" || item?.warehouse?.status === statusFilter;
            const searchMatch =
                item.product?.product_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.warehouse?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.product?.product_code
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return warehouseMatch && cityMatch && statusMatch && searchMatch;
        });
    }, [
        allFlattenedStocks,
        selectedWarehouse,
        selectedCity,
        statusFilter,
        searchTerm,
    ]);

    // pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    //  paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, pageSize]);

    const [selectedStock, setSelectedStock] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleView = (item) => {
        setSelectedStock(item);
        setOpenModal(true);
    };

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
        {
            key: "product.product_code",
            label: "Product Code",
            render: (item) => item?.product?.product_code || "—",
        },
        { key: "warehouse.name", label: "Warehouse" },
        {
            key: "warehouse.city",
            label: "City",
            render: (item) => item?.warehouse?.city || "—",
        },
        {
            key: "product.batch_number",
            label: "Batch No",
            render: (item) => item?.product?.batch_number || "—",
        },
        { key: "quantity", label: "Quantity" },
        {
            key: "warehouse.status",
            label: "Status",
            render: (item) => (
                <Chip
                    label={item?.warehouse?.status || "—"}
                    color={item?.warehouse?.status === "active" ? "success" : "default"}
                    size="small"
                />
            ),
        },
    ];

    const actions = [
        {
            label: "View",
            icon: Visibility,
            tooltip: "View Details",
            onClick: handleView,
        },
    ];

    const uniqueWarehouses = [
        ...new Set(allFlattenedStocks.map((item) => item?.warehouse?.name)),
    ].filter(Boolean);
    const uniqueCities = [
        ...new Set(allFlattenedStocks.map((item) => item?.warehouse?.city)),
    ].filter(Boolean);

    const totalWarehouses = new Set(
        allFlattenedStocks.map((item) => item.warehouseId)
    ).size;
    const totalQuantity = allFlattenedStocks.reduce(
        (acc, cur) => acc + (cur?.quantity || 0),
        0
    );

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleWarehouseChange = (value) => {
        setSelectedWarehouse(value);
        setCurrentPage(1);
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

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
            />

            <Box className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl border">
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                        value={selectedWarehouse}
                        onChange={(e) => handleWarehouseChange(e.target.value)}
                        label="Warehouse"
                    >
                        <MenuItem value="all">All</MenuItem>
                        {uniqueWarehouses.map((name) => (
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
                        onChange={(e) => handleCityChange(e.target.value)}
                        label="City"
                    >
                        <MenuItem value="all">All</MenuItem>
                        {uniqueCities.map((city) => (
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
                        onChange={(e) => handleStatusChange(e.target.value)}
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
                    placeholder="Search by product name, code or warehouse..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 240 }}
                />

                <button
                    onClick={() => {
                        refetch();
                        setCurrentPage(1);
                    }}
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Refresh
                </button>
            </Box>

            <Table
                title={`Warehouse Stock Data (${filteredData.length} items)`}
                columns={columns}
                data={paginatedData}
                actions={actions}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onSearch={handleSearch}
                searchPlaceholder="Search by product name, code or warehouse..."
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
