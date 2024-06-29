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
    // storybook controls -- not used in the component
    SB_Init_Value: {
      control: "text",
      description:
        "Initial value for the text field, does not effect value after initial render",
      default: "Text Field Value",
    },
    SB_GridSize: {
      control: "number",
      description: "Grid size for the text field",
      default: 6,
    },
  },
  decorators: [
    (Story, { args }) => {
      const formController = useForm({
        defaultValues: {
          nameOfField: args.SB_Init_Value || "",
        },
      });
      return (
        <FormProvider {...formController}>
          <Grid container spacing={2}>
            <Grid item xs={args.SB_GridSize || 6}>
              <Story {...args} />
            </Grid>
          </Grid>
        </FormProvider>
      );
    },
  ],
};

export const Default = {
  args: {
    name: "nameOfField",
    label: "Text Field",
  },
};

export const Required = {
  args: {
    name: "nameOfField",
    label: "Text Field",
    required: true,
    SB_Init_Value: "Required Value",
  },
};

export const Disabled = {
  args: {
    name: "nameOfField",
    label: "Text Field",
    disabled: true,
    SB_Init_Value: "Disabled Value",
  },
};

export const Empty = {
  args: {
    name: "nameOfField",
    label: "Text Field",
    SB_Init_Value: "",
  },
};

export const GridSize = {
  args: {
    name: "nameOfField",
    label: "Text Field",
    SB_Init_Value: "Grid Size Value",
    SB_GridSize: 12,
  },
};
