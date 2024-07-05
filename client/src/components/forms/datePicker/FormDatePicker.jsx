// mui
import { DatePicker } from "@mui/x-date-pickers";
import { FormControl } from "@mui/material";
// React hook form
import { useController } from "react-hook-form";

// const FileName
const FormDatePicker = ({ name, label, control, actionBarActions, ...otherProps }) => {
  // react hook form use controller
  const RHFController = useController({
    name: name,
    control,
  });
  // return ()
  return (
    <FormControl margin="normal" fullWidth size="small">
      <DatePicker
        size="small"
        label={label}
        {...RHFController.field}
        slotProps={{
          textField: {
            error: !!RHFController.fieldState.error,
            helperText: RHFController.fieldState.error?.message,
          },

          actionBar: { actions: actionBarActions },
        }}
        {...otherProps}
      />
    </FormControl>
  );
};

// export default
export default FormDatePicker;
