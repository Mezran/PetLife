import { FormProvider, useForm } from "react-hook-form";

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
    isViewState: {
      control: "boolean",
      description: "View State, view or edit",
    },
    name: {
      control: "text",
      description: "Must be unique. Used internally for react hook form.",
    },
    label: {
      control: "text",
      description: "Label for the input field and display",
    },
    required: {
      control: "boolean",
      default: false,
      description: "Is this field required?",
    },
  },
  decorators: [
    (Story, { args }) => {
      const formController = useForm({
        defaultValues: {
          nameOfField: "Value XX",
        },
      });
      return (
        <FormProvider {...formController}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Story {...args} />
            </Grid>
          </Grid>
        </FormProvider>
      );
    },
  ],
};

export const ViewState = {
  args: {
    isViewState: true,
    name: "nameOfField",
    label: "Text Field",
    required: false,
  },
};

export const EditState = {
  args: {
    isViewState: false,
    name: "nameOfField",
    label: "Text Field",
    required: true,
  },
};
