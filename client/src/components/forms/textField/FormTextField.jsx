// mui
import { TextField } from "@mui/material";
// React hook form
import { useController } from "react-hook-form";

// const FileName
const FormTextField = ({ name, label, control, ...otherProps }) => {
  // react hook form use controller
  const { field, fieldState } = useController({
    name: name,
    control,
  });
  // return ()
  return (
    <TextField
      margin="normal"
      fullWidth
      label={label}
      {...field}
      error={fieldState.error}
      helperText={fieldState.error?.message}
      {...otherProps}
    />
  );
};

// export default
export default FormTextField;
