/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import TASRightSideModal from "../../../components/Share/Modal/Modal";
import { useForm } from "react-hook-form";
import TASForm from "../../../components/form/Form";
import { Box, Button, Grid } from "@mui/material";
import TASInput from "../../../components/form/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  "sub-category": z.string().min(1, "Subcategory is required"),
  category: z.string().min(1, "Main Category is required"),
  image: z
    .any()
    .refine((val) => val !== null, { message: "Category image is required" }),
});

const UpdatePurchaseProductModal = ({ open, setOpen, product, onClose }) => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      "sub-category": product?.["sub-category"] || "",
      category: product?.category || "",
      image: null,
    },
  });

  const handleSubmitForm = (data) => {
    onClose();
  };

  return (
    <TASRightSideModal
      open={open}
      setOpen={setOpen}
      title="Update Product  "
      width="500px"
      onClose={onClose}
    >
      <Box padding="20px">
        <TASForm onSubmit={handleSubmit(handleSubmitForm)}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TASInput size="medium" fullWidth name="name" label=" Name " />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TASInput size="medium" fullWidth name="name" label="Price" />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TASInput size="medium" fullWidth name="name" label="Unit" />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TASInput size="medium" fullWidth name="name" label="Tax" />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TASInput size="medium" fullWidth name="name" label="Discount" />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button
                sx={{ color: "white" }}
                type="submit"
                onClick={handleSubmitForm}
              >
                Update Product
              </Button>
            </Grid>
          </Grid>
        </TASForm>
      </Box>
    </TASRightSideModal>
  );
};

export default UpdatePurchaseProductModal;
