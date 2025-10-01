/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import {
  useCreateLeaveRequestMutation,
  useGetSingleLeaveRequestQuery,
  useUpdateLeaveRequestMutation,
} from "../../../../redux/api/leaveRequestApi";
import { toast } from "react-toastify";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import { leaveRequest } from "../../../../utils/options";
import RequestLeaveModal from "./RequestLeaveModal";
import Loading from "../../../../components/Loading/Loading";
import { useEffect, useState } from "react";
const LeaveRequestForm = ({ tenantDomain, onClose, id, leaveRequestId, employeeId }) => {
  const { data, isLoading } = useGetSingleLeaveRequestQuery({
    tenantDomain,
    leaveRequestsId: leaveRequestId,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [createLeaveRequest] = useCreateLeaveRequestMutation();
  const [updateLeaveRequest] = useUpdateLeaveRequestMutation();
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const handleFormSubmit = async (data) => {
    const toastId = toast.loading(
      `${id ? "Updating" : "Creating"} leave request...`
    );

    const modifyData = {
      employee: employeeId,
      noOfDays: Number(data.noOfDays),
      remainingLeaves: Number(data.remainingLeaves),
      leaveType: data.leaveType,
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.reason,
    };

    try {
      const res = await createLeaveRequest({
        tenantDomain,
        ...modifyData,
      }).unwrap();
      toast.success(res.message || "Leave request created successfully!");

      reset();
      onClose();
    } catch (error) {
      toast.error(
        "Error creating leave request: " +
          (error.message || "Something went wrong!")
      );
    } finally {
      toast.dismiss(toastId);
    }
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating leave request...");
    const modifyData = {
      employeeId: leaveRequestId,
      noOfDays: Number(data.noOfDays),
      remainingLeaves: Number(data.remainingLeaves),
      leaveType: data.leaveType,
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.reason,
      status: status,
    };

    try {
      const res = await updateLeaveRequest({
        tenantDomain,
        id:leaveRequestId,
        ...modifyData,
      }).unwrap();
      toast.success(res.message || "Leave request update successfully!");

      reset();
      onClose();
    } catch (error) {
      toast.error(
        "Error updating leave request: " +
          (error.message || "Something went wrong!")
      );
    } finally {
      toast.dismiss(toastId);
    }
  };

  const singleLeaveRequest = data?.data;
  useEffect(() => {
    if (singleLeaveRequest?.status) {
      setStatus(singleLeaveRequest.status);
    }
  }, [singleLeaveRequest]);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <RequestLeaveModal onClose={onClose}>
      <h2 className="text-sm md:text-xl font-semibold text-center">
        Request Leave
      </h2>
      <form
        onSubmit={handleSubmit(leaveRequestId ? onSubmit : handleFormSubmit)}
      >
        <div className="flex">
          <label className="block mb-1">Leave Type</label>
          <span className="ml-1 text-red-600">*</span>
        </div>
        <Autocomplete
          freeSolo
          disableClearable
          size="small"
          options={leaveRequest.map((option) => option.label)}
          onChange={(event, newValue) => {
            setValue("leaveType", newValue);
          }}
          defaultValue={leaveRequest.find(
            (option) => option.label === singleLeaveRequest?.leaveType
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search input"
              slotProps={{
                input: {
                  ...params.InputProps,
                  type: "search",
                },
              }}
            />
          )}
        />

        {errors.leaveType && (
          <p className="text-red-600">{errors.leaveType.message}</p>
        )}

        <div className="mt-4">
          <div className="flex">
            <label className="block mb-1">From</label>
            <span className="ml-1 text-red-600">*</span>
          </div>
          <input
            type="date"
            className="w-full border-2-[#ddd] border p-2 rounded-sm"
            {...register("fromDate", { required: "From date is required" })}
            defaultValue={
              singleLeaveRequest?.fromDate
                ? new Date(singleLeaveRequest?.fromDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
          />
          {errors.fromDate && (
            <p className="text-red-600">{errors.fromDate.message}</p>
          )}
        </div>
        <div className="mt-4">
          <div className="flex">
            <label className="block mb-1">To</label>
            <span className="ml-1 text-red-600">*</span>
          </div>
          <input
            type="date"
            className="w-full border-2-[#ddd] border p-2 rounded-sm"
            {...register("toDate", { required: "To date is required" })}
            defaultValue={
              singleLeaveRequest?.toDate
                ? new Date(singleLeaveRequest?.toDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
          />
          {errors.toDate && (
            <p className="text-red-600">{errors.toDate.message}</p>
          )}
        </div>
        <div className="mt-4">
          <div className="flex">
            <label className="block mb-1">No of Days</label>
            <span className="ml-1 text-red-600">*</span>
          </div>
          <input
            type="text"
            className="w-full border-2-[#ddd] border p-2 rounded-sm bg-[#E9ECEF]"
            {...register("noOfDays", {
              required: "Number of days is required",
            })}
            defaultValue={singleLeaveRequest?.noOfDays}
          />
          {errors.noOfDays && (
            <p className="text-red-600">{errors.noOfDays.message}</p>
          )}
        </div>

        <div className="mt-4">
          <div className="flex">
            <label className="block mb-1">Remaining Leaves</label>
            <span className="ml-1 text-red-600">*</span>
          </div>
          <input
            type="text"
            className="w-full border-2-[#ddd] border p-2 rounded-sm bg-[#E9ECEF]"
            {...register("remainingLeaves", {
              required: "Remaining leaves is required",
            })}
            defaultValue={singleLeaveRequest?.remainingLeaves}
          />
          {errors.remainingLeaves && (
            <p className="text-red-600">{errors.remainingLeaves.message}</p>
          )}
        </div>
        {leaveRequestId && (
          <div className="mt-4">
            <div className="flex">
              <label className="block mb-1">Status</label>
            </div>
            <Select
              fullWidth
              value={status}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              defaultValue={singleLeaveRequest?.status}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
            {errors.remainingLeaves && (
              <p className="text-red-600">{errors.remainingLeaves.status}</p>
            )}
          </div>
        )}
        <div className="mt-4">
          <div className="flex">
            <label className="block mb-1">Reason</label>
            <span className="ml-1 text-red-600">*</span>
          </div>

          <textarea
            className="border-2-[#ddd] border w-full h-[70px] rounded-sm resize-none p-2"
            {...register("reason", { required: "Reason is required" })}
            defaultValue={singleLeaveRequest?.reason}
          ></textarea>
          {errors.reason && (
            <p className="text-red-600">{errors.reason.message}</p>
          )}
        </div>

        <div className="mt-3 text-center">
          <button
            type="submit"
            className="border-2-[#ddd] border rounded-2xl w-52 h-12 mx-auto bg-[#FF851A] text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </RequestLeaveModal>
  );
};

export default LeaveRequestForm;
