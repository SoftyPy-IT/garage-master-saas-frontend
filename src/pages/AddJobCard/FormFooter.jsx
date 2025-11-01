/* eslint-disable react/prop-types */
import { Button, TextField } from "@mui/material";
import { requiredFields } from "../../config/jobCardFormConfig";
import Can from "../../components/Can";

const FormFooter = ({ register, errors, createJobCardLoading }) => (
    <>
        <div className="flex flex-wrap items-center justify-between mt-5 mb-10">
            <div>
                <TextField
                    className="ownerInput"
                    {...register("technician_name")}
                    label="Technician Name (T)"
                />
            </div>
            <div>
                <TextField
                    disabled
                    className="ownerInput"
                    {...register("technician_signature")}
                    label="Technician Signature (T)"
                />
            </div>
            <div>
                <input
                    className={`border h-14 w-60 px-3 rounded-sm ${errors.technician_date ? "border-red-500" : ""}`}
                    type="date"
                    {...register("technician_date", { required: requiredFields.technician_date })}
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    min={new Date().toISOString().split("T")[0]}
                />
                {errors.technician_date && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.technician_date.message}</p>
                )}
            </div>
            <div>
                <TextField
                    disabled
                    className="ownerInput"
                    {...register("vehicle_owner")}
                    label="Vehicle Owner (T)"
                />
            </div>
        </div>

        <div className="mt-3">
            <b>This is not an invoice, all estimates are valid for 30 days</b>
        </div>

        <div className="mt-5 flex justify-center">
            <Can page="/dashboard/create-job-card" action="create">
                <Button
                    sx={{ color: "#fff", borderRadius: "20px" }}
                    disabled={createJobCardLoading}
                    type="submit"
                >
                    Add To Job Card
                </Button>
            </Can>
        </div>
    </>
);

export default FormFooter;