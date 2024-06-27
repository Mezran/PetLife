// mui
import { TextField, Box, Typography, Divider } from "@mui/material";
// React hook form
import { useController } from "react-hook-form";

// const FileName
const FormTextField = ({ isViewState, name, label, control, ...otherProps }) => {
  // react hook form use controller
  const { field } = useController({
    name: name,
    control,
  });
  // return ()
  return isViewState ? (
    <Box mt={2} mb={1} height={40} alignContent="center">
      <Typography pl={2} py={1}>{`${label}: ${field.value}`}</Typography>
      <Divider />
    </Box>
  ) : (
    <TextField
      margin="normal"
      fullWidth
      size="small"
      label={label}
      onChange={field.onChange} // send value to hook form
      onBlur={field.onBlur} // notify when input is touched/blur
      value={field.value} // input value
      name={field.name} // send down the input name
      inputRef={field.ref} // send input ref, so we can focus on input when error appear
      // onChange={RHFController.field.onChange}
      // onBlur={RHFController.field.onBlur}
      // value={RHFController.field.value}
      // name={RHFController.field.name}
      // inputRef={RHFController.field.ref}
      // error={!!RHFController.fieldState.error}
      // helperText={RHFController.fieldState.error?.message}
      {...otherProps}
    />
  );
};

// export default
export default FormTextField;
