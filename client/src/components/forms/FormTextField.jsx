// mui
import { TextField, Box, Typography, Divider } from "@mui/material";
// React hook form
import { useController } from "react-hook-form";

// const FileName
const FormTextField = ({ isViewState, name, label, control, ...otherProps }) => {
  // react hook form use controller
  const RHFController = useController({
    name: name,
    control,
  });
  // console.log(RHFController.field);
  // return ()
  return isViewState ? (
    <Box mt={2} mb={1} height={40} alignContent="center">
      <Typography py={1}>{`${label}: ${RHFController.field.value}`}</Typography>
      <Divider />
    </Box>
  ) : (
    <TextField
      margin="normal"
      fullWidth
      size="small"
      label={label}
      {...RHFController.field}
      error={!!RHFController.fieldState.error}
      helperText={RHFController.fieldState.error?.message}
      {...otherProps}
    />
  );
};

// export default
export default FormTextField;
