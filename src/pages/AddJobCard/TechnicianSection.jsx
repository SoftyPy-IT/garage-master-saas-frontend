/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import JobCardDateInput from "../../../components/form/JobcardDateInput";

const TechnicianSection = ({ register, errors }) => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between mt-5 mb-10">
        <div>
          <TextField
            className="ownerInput"
            {...register("technician_name")}
            label="Technician Name (T)"
          />
          <br />
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
          <JobCardDateInput
            register={register}
            name="technician_date"
            label="Technician Date"
            required={true}
            error={errors.technician_date}
            helperText={errors.technician_date?.message}
          />
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
    </>
  );
};

export default TechnicianSection;
