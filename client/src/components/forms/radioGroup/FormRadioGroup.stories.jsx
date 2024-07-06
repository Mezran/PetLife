import { useForm } from "react-hook-form";

import FormRadioGroup from "./FormRadioGroup";
import { Grid } from "@mui/material";

export default {
  component: FormRadioGroup,
  title: "Forms/FormRadioGroup",
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
      default: "Radio Group",
    },
    options: {
      control: "object",
      description: "Options for the radio group",
      default: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    },
  },
};

const Template = (args) => {
  const RHFCont = useForm({
    defaultValues: {
      nameOfField: "option1",
    },
  });

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormRadioGroup {...args} control={RHFCont.control} />
      </Grid>
    </Grid>
  );
};

export const Default = {
  args: {
    name: "nameOfField",
    label: "Radio Group",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  },
  render: (args) => {
    return <Template {...args} />;
  },
};

export const Row = {
  args: {
    name: "nameOfField",
    label: "Radio Group",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    row: true,
  },
  render: (args) => {
    return <Template {...args} />;
  },
};
