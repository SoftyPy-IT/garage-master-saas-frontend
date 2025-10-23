import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import {
  useDeleteProductMutation,
  useGetAllIProductQuery,
} from "../../../redux/api/productApi";

const ProductTable = () => {
  const { data } = useGetAllIProductQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id).unwrap();
          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "An error occurred while deleting the product.",
            "error"
          );
        }
      }
    });
  };

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "product_name", headerName: "Product Name", flex: 1 },
    { field: "barcode", headerName: "Bar Code", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    { field: "discount", headerName: "Discount", flex: 1 },
    { field: "expense", headerName: "Expense", flex: 1 },
    { field: "product_code", headerName: "Product Code", flex: 1 },
    { field: "unit", headerName: "Unit", flex: 1 },
    { field: "product_price", headerName: "Product Price", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <>
          <div className="flex items-center gap-1">
            <Link to={`/dashboard/update-product/?id=${params.id}`}>
              <IconButton
                sx={{ ...iconButtonStyle, background: "#42A1DA" }}
                title="Edit"
              >
                <EditIcon sx={iconStyle} />
              </IconButton>
            </Link>

            <IconButton sx={iconButtonStyle} title="Delete">
              <DeleteIcon
                onClick={() => handleDelete(params.id)}
                sx={iconStyle}
              />
            </IconButton>
          </div>
        </>
      ),
    },
  ];

  const rows = data?.data?.products.map((product) => ({
    id: product._id,
    date: new Date(product.createdAt).toLocaleDateString(),
    product_name: product.product_name,
    barcode: product.barcode,
    brand: product.brand.brand,
    category: product?.category?.main_category,
    discount: product.discount,
    expense: product.expense,
    product_code: product.product_code,
    unit: product.unit.unit,
    product_price: `$${product.product_price}`,
  }));

  const iconButtonStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "100%",
    padding: "0px",
    color: "white",
    background: "red",
    marginLeft: "2px",
    marginRight: "2px",
    "&:hover": {
      background: "black",
      color: "white",
    },
  };
  const iconStyle = { fontSize: "20px" };

  
  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default ProductTable;
