import { useForm } from "react-hook-form";

import FormSelect from "./FormSelect";
import { Grid } from "@mui/material";

export default {
  component: FormSelect,
  title: "Forms/FormSelect",
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
      default: "Select Field",
    },
    options: {
      control: "object",
      description: "Options for the select field",
      default: [{ value: "Unknown", label: "Unknown" }],
    },
  },
};

const Template = (args) => {
  const RHFCont = useForm({
    defaultValues: {
      nameOfField: "Select1",
    },
  });

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormSelect {...args} control={RHFCont.control} />
      </Grid>
    </Grid>
  );
};

export const Default = {
  args: {
    name: "nameOfField",
    label: "Select Field",
    options: [
      { value: "Select1", label: "Select 1" },
      { value: "Select2", label: "Select 2" },
      { value: "Select3", label: "Select 3" },
    ],
  },
  render: (args) => {
    return <Template {...args} />;
  },
};
