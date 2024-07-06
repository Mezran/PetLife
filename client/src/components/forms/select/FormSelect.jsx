// mui
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
// React hook form
import { useController } from "react-hook-form";

// const FileName
const FormSelect = ({ name, label, control, options, ...otherProps }) => {
  // react hook form use controller
  const RHFController = useController({
    name: name,
    control,
  });
  // return ()
  return (
    <FormControl margin="normal" fullWidth>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        label={label}
        {...RHFController.field}
        error={RHFController.fieldState.error}
        {...otherProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{RHFController.fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
};

// export default
export default FormSelect;
