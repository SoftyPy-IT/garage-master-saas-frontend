/* eslint-disable react/prop-types */
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const FormDatePicker = ({
  name,
  size = "medium",
  label,
  required,
  fullWidth = true,
  margin = "normal",
  sx,
  // disableFuture = true,
  // disablePast = false,
  defaultValue = dayjs().format("YYYY-MM-DD"),
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref } }) => {
        const dateValue = value ? dayjs(value) : null;

        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              inputRef={ref}
              label={label}
              value={dateValue}
              onChange={(date) => {
                const formatted = date ? dayjs(date).format("YYYY-MM-DD") : "";
                onChange(formatted);
              }}
              // disableFuture={disableFuture}
              // disablePast={disablePast}
              slotProps={{
                textField: {
                  required: required,
                  size: size,
                  fullWidth: fullWidth,
                  margin: margin,
                  variant: "outlined",
                  sx: { ...sx, width: fullWidth ? "100%" : undefined },
                },
              }}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default FormDatePicker;
