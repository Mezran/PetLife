import { FormProvider, useForm } from "react-hook-form";

import FormTextField from "./FormTextField";

export default {
  component: FormTextField,
  title: "Forms/FormTextField",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    //isViewState, data, name, label, control, ...otherProps
    isViewState: {
      control: "boolean",
      description: "View State, view or edit",
    },
    data: {
      control: "text",
      description: "Data to display",
    },
    name: {
      control: "text",
      description: "Must be unique. Used internally for react hook form.",
    },
    label: {
      control: "text",
      description: "Label for the input field and display",
    },
  },
  decorators: [
    (Story) => (
      <FormProvider {...useForm()}>
        <Story />
      </FormProvider>
    ),
  ],
};

export const ViewState = {
  args: {
    isViewState: true,
    data: "Secondary Data",
    name: "secondaryTextField",
    label: "Secondary Text Field",
  },
};

export const EditState = {
  args: {
    isViewState: false,
    data: "Primary Data",
    name: "primaryTextField",
    label: "Primary Text Field",
  },
};
