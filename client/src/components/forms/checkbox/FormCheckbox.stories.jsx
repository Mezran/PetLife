import { useForm } from "react-hook-form";

import FormCheckbox from "./FormCheckbox.jsx";
import { Grid } from "@mui/material";

export default {
  component: FormCheckbox,
  title: "Forms/FormCheckbox",
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
      default: "Checkbox",
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
      nameOfField: false,
    },
  });

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormCheckbox {...args} control={RHFCont.control} />
      </Grid>
    </Grid>
  );
};

export const Default = {
  args: {
    name: "nameOfField",
    label: "Checkbox",
  },
  render: (args) => {
    return <Template {...args} />;
  },
};
