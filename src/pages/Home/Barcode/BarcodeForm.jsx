/* eslint-disable no-unused-vars */
import TASForm from "../../../components/form/Form";
import { Button, Grid } from "@mui/material";
import TASInput from "../../../components/form/Input";
import TASAutocomplete from "../../../components/form/Autocomplete";
import TASTextarea from "../../../components/form/Textarea";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAppOptions } from '../../../hooks/useAppOptions.js'
const BarcodeForm = () => {
  const { productOptions,
    createBarcode
  } = useAppOptions()


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
    let res;
    try {
      res = await createBarcode(modifyValues).unwrap();
      if (res.success) {
        toast.update(toastId, {
          render: "Barcode created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

    } catch (error) {

      toast.update(toastId, {
        render: ` ${error.message || "Something went wrong!"}`,
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
