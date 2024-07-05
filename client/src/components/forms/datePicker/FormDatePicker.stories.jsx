import { useForm } from "react-hook-form";

import FormDatePicker from "./FormDatePicker.jsx";
import { Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { DevTool } from "@hookform/devtools";

export default {
  component: FormDatePicker,
  title: "Forms/FormDatePicker",
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
      default: "Date Picker",
    },
    actionBarActions: {
      control: "object",
      description: "Actions for the date picker",
      default: ["accept", "cancel", "clear", "today"],
    },
    // storybook controls -- not used in the component
  },
};

const Template = (args) => {
  const RHFCont = useForm({
    defaultValues: {
      nameOfField: dayjs(new Date()),
    },
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container>
        <Grid item xs={6}>
          <FormDatePicker {...args} control={RHFCont.control} />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export const Default = {
  args: {
    name: "nameOfField",
    label: "Date Picker",
    actionBarActions: ["accept", "cancel", "clear", "today"],
  },
  render: (args) => {
    return <Template {...args} />;
  },
};
