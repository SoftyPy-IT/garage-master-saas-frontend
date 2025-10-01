/* eslint-disable no-unused-vars */
import TASForm from "../../../components/form/Form";
import { Button, Grid } from "@mui/material";
import TASInput from "../../../components/form/Input";
import TASAutocomplete from "../../../components/form/Autocomplete";
import TASTextarea from "../../../components/form/Textarea";
import { toast } from "react-toastify";
import { useCreateBarcodeMutation } from "../../../redux/api/barcodeApi";
import { useGetAllIProductQuery } from "../../../redux/api/productApi";
import { useMemo, useState } from "react";
const BarcodeForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createBarcode] = useCreateBarcodeMutation();
  const { data: productData } = useGetAllIProductQuery({
    limit: 999999999999999,
    page: currentPage,
    searchTerm: "",
  });

  const productOptions = useMemo(() => {
    if (!productData?.data?.products) return [];
    return productData.data.products.map((product) => ({
      label: product.product_name,
      value: product._id,
    }));
  }, [productData?.data?.products]);

  const handleSubmit = async (data) => {
    const modifyValues = {
      ...data,
      product_id:
        data.product_id &&
        data.product_id[0] &&
        productOptions.find((cat) => cat.label === data.product_id[0])?.value
          ? [
              productOptions.find((cat) => cat.label === data.product_id[0]).value,
            ]
          : [],
    };
  
    const toastId = toast.loading("Creating Barcode...");
  
    try {
      const res = await createBarcode(modifyValues).unwrap();

      toast.update(toastId, {
        render: "Barcode created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000, 
      });
    } catch (error) {

      toast.update(toastId, {
        render: `Error creating barcode: ${error.message || "Something went wrong!"}`,
        type: "error",
        isLoading: false,
        autoClose: 3000, 
      });
    }
  };
  

  return (
    <TASForm onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TASInput size="medium" fullWidth name="name" label="Barcode Name " />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TASAutocomplete
            size="medium"
            fullWidth
            name="product_id"
            label="Search Product"
            options={productOptions}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TASTextarea minRows={3} name="description" label="Description" />
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Button type="submit" sx={{ color: "white" }}>
            Genrate Barcode{" "}
          </Button>
        </Grid>
      </Grid>
    </TASForm>
  );
};

export default BarcodeForm;
