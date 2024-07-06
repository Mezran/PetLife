import { useForm } from "react-hook-form";

import FormTextField from "./FormTextField";
import { Grid } from "@mui/material";

export default {
  component: FormTextField,
  title: "Forms/FormTextField",
  parameters: {
    // layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Must be unique. Used internally for react hook form.",
      default: "nameOfField",
    },
    label: {
      control: "text",
      description: "Label for the input field and display",
      default: "Text Field",
    },
    required: {
      control: "boolean",
      default: false,
      description: "Is this field required?",
    },
    disabled: {
      control: "boolean",
      default: false,
      description: "Is this field disabled?",
    },
  },
};

const Template = (args) => {
  const RHFCont = useForm({
    defaultValues: {
      nameOfField: "test",
    },
  });

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormTextField {...args} control={RHFCont.control} />
      </Grid>
    </Grid>
  );
};

export const Default = {
  args: {
    name: "nameOfField",
    label: "Text Field",
  },
  render: (args) => {
    return <Template {...args} />;
  },
};

export const InputAdornment = {
  args: {
    name: "nameOfField",
    label: "Text Field",
    InputProps: {
      endAdornment: "lb",
    },
  },
  render: (args) => {
    return <Template {...args} />;
  },
};
