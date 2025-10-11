
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useStockTransactions } from "../../../hooks/useStockTransactions";
import SummaryCards from "./SummaryCards";
import TransactionTable from "./TransactionTable";

const StockTransaction = () => {
  const theme = useTheme();
  const {
    // Data
    totalTransactions,
    totalIn,
    totalOut,
    error,
    isLoading,
    paginatedTransactions,
    headCells,
    page,
    rowsPerPage,
    order,
    orderBy,
    filteredTransactions,
    searchTerm,
    filterType,

    // Actions
    handleRefresh,
    handleExport,
    setPage,
    setRowsPerPage,
    handleRequestSort,
    setSearchTerm,
    setFilterType,
  } = useStockTransactions();

  return (
    <Box
      sx={{
        paddingY: 1,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        minHeight: "100vh",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          Failed to load stock transactions. Please try again.
        </Alert>
      )}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: {sm:"flex"},
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography              
              color="primary.main"
            >
              <div className="text-[27px] md:text-4xl font-semibold">
              Stock Transactions
              </div>
            </Typography>
            <div className="flex justify-end">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{ mr: 1, padding:"5px" }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : "Refresh"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                sx={{ padding:"5px" }}
              >
                Export
              </Button>
            </div>
          </Box>

          <SummaryCards
            totalTransactions={totalTransactions}
            totalIn={totalIn}
            totalOut={totalOut}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <CardContent>
          <TransactionTable
            paginatedTransactions={paginatedTransactions}
            headCells={headCells}
            page={page}
            rowsPerPage={rowsPerPage}
            order={order}
            orderBy={orderBy}
            filteredTransactions={filteredTransactions}
            isLoading={isLoading}
            searchTerm={searchTerm}
            filterType={filterType}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            handleRequestSort={handleRequestSort}
            setSearchTerm={setSearchTerm}
            setFilterType={setFilterType}
          />
        </CardContent>
      </Card>

      <Card
        sx={{
          mt: 3,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <InfoIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="subtitle2" color="textSecondary">
              Stock Transaction Information
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            This page displays all stock transactions in your system. Each
            transaction represents a movement of products between warehouses or
            locations. You can filter by transaction type (Stock In/Out) and
            search by product name, warehouse, or reference information.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockTransaction;
