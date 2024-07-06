// mui
import { Checkbox, FormControlLabel } from "@mui/material";

// react hook form
import { useController } from "react-hook-form";

// const FileName
const FormCheckbox = ({ name, label, control, ...otherProps }) => {
  const RHFController = useController({
    name: name,
    control,
  });
  return (
    <FormControlLabel
      label={label}
      control={
        <Checkbox
          {...RHFController.field}
          checked={RHFController.field.value}
          {...otherProps}
        />
      }
    />
  );
};

// export default
export default FormCheckbox;
