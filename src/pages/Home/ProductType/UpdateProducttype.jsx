/* eslint-disable react/prop-types */
import { Button, Grid, Typography } from "@mui/material";
import TASForm from "../../../components/form/Form";
import TAFileupload from "../../../components/form/Fileupload";
import TASInput from "../../../components/form/Input";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetSingleUnitQuery,
  useUpdateUnitMutation,
} from "../../../redux/api/unitApi";

const UpdateProducttype = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { data, isLoading } = useGetSingleUnitQuery(id);
  const [updateCategory] = useUpdateUnitMutation();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const imageToSubmit =
        formData.image && formData.image.length > 0
          ? formData.image[0]
          : data?.data?.image;

      const res = await updateCategory({
        ...formData,
        image: imageToSubmit,
        id,
      }).unwrap();

      if (res.success) {
        toast.success("Unit updated successfully!");
        navigate("/dashboard/unit");
      }
    } catch (error) {
      toast.error(
        "Error updating unit: " + (error.message || "Something went wrong")
      );
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const defaultValues = {
    unit: data?.data?.unit || "",
    short_name: data?.data?.short_name || "",
    image: data?.data?.image || "",
  };

  return (
    <div className="py-10">
      <div className="ml-5">
        <h2 className="mb-3">Update Unit</h2>
        <span> Product &gt; Unit</span>
      </div>
      <div className="bg-[#F7F7F7] p-8 mt-5 ">
        <div className="flex gap-x-8 bg-[#FFFFFF] p-8 rounded-md ">
          <div className="w-[700px]">
            <TASForm onSubmit={handleSubmit} defaultValues={defaultValues}>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TAFileupload
                    fullWidth
                    name="image"
                    label="Upload Unit Image" defaultValues={data?.data?.image}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography fontWeight="semi-bold" mb={1}>
                    Name
                  </Typography>
                  <TASInput
                    size="medium"
                    fullWidth
                    name="unit"
                    label=" Name "
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography fontWeight="semi-bold" mb={1}>
                    Short Name
                  </Typography>
                  <TASInput
                    size="medium"
                    fullWidth
                    name="short_name"
                    label="Short Name "
                  />
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Button sx={{ color: "white" }} type="submit">
                    Update Unit
                  </Button>
                </Grid>
              </Grid>
            </TASForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProducttype;
