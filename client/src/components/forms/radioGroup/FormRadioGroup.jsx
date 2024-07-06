// mui
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
// React hook form
import { useController } from "react-hook-form";

// const FileName
const FormRadioGroup = ({ name, label, control, options, ...otherProps }) => {
  // react hook form use controller
  const RHFController = useController({
    name: name,
    control,
  });
  // return ()
  return (
    <FormControl>
      <RadioGroup {...RHFController.field} {...otherProps}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{RHFController.fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
};

// export default
export default FormRadioGroup;
