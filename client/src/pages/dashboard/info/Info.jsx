// imports
import React, { useEffect } from "react";

// Material UI
import {
  Box,
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"; // React Router Dom
// Redux
import { useSelector } from "react-redux";
import { usePetGetOneQuery } from "../../../redux/pet/petApiSlice.js";
// React Hook Form, yup, resolver
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DevTool } from "@hookform/devtools";
// dayjs
import dayjs from "dayjs";

// components
import FormTextField from "../../../components/forms/textField/FormTextField.jsx";
import FormDatePicker from "../../../components/forms/datePicker/FormDatePicker.jsx";
import FormSelect from "../../../components/forms/select/FormSelect.jsx";
import FormRadioGroup from "../../../components/forms/radioGroup/FormRadioGroup.jsx";

// const FileName
const Info = () => {
  // local state
  // React Router Dom
  // Redux
  const selectedPet_id = useSelector((state) => state.pet.selectedPet_id);
  const {
    data: petData,
    isLoading,
    isFetching,
    isError,
  } = usePetGetOneQuery(selectedPet_id, { skip: selectedPet_id === null });
  // React Hook Form
  // - schema
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    nickName: yup.string().nullable(),
    dateOfBirth: yup.date().nullable(),
    dateOfAdoption: yup.date().nullable(),
    gender: yup.string().oneOf(["Unknown", "Male", "Female"]),
    species: yup.string().nullable(),
    breed: yup.string().nullable(),
    color: yup.string().nullable(),
    weight: yup.number().nullable(),
    weightUnit: yup.string(),
    height: yup.number().nullable(),
    heightUnit: yup.string(),
  });
  // - defaultValues
  const defaultValues = {
    name: selectedPet_id != null && !isFetching ? petData?.pet?.name : "",
    nickName: selectedPet_id != null && !isFetching ? petData?.pet?.nickName : "",
    dateOfBirth:
      selectedPet_id != null && !isFetching ? dayjs(petData?.pet?.dateOfBirth) : null,
    dateOfAdoption:
      selectedPet_id != null && !isFetching ? dayjs(petData?.pet?.dateOfAdoption) : null,
    gender: selectedPet_id != null && !isFetching ? petData?.pet?.gender : "Unknown",
    species: selectedPet_id != null && !isFetching ? petData?.pet?.species : "",
    breed: selectedPet_id != null && !isFetching ? petData?.pet?.breed : "",
    color: selectedPet_id != null && !isFetching ? petData?.pet?.color : "",
    weight: selectedPet_id != null && !isFetching ? petData?.pet?.weight : "",
    weightUnit: selectedPet_id != null && !isFetching ? petData?.pet?.weightUnit : "lb",
    height: selectedPet_id != null && !isFetching ? petData?.pet?.height : "",
    heightUnit: selectedPet_id != null && !isFetching ? petData?.pet?.heightUnit : "in",
  };

  // - const {} = useForm;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    getValues,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    // defaultValues: defaultValues,
  });
  // onXXSubmit
  const onPetInfoSubmit = (data) => {
    console.log(data);
  };

  const onButtonResetClick = () => {
    reset();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [selectedPet_id, petData]);

  // return () {}
  if (isLoading || isFetching) return <Box>Loading...</Box>;
  return (
    <Box component="form" noValidate>
      <DevTool control={control} placement="top-right" />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography variant="h6" color="inherit">
                Pet Info
              </Typography>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                disabled={!isDirty || isSubmitting}
                onClick={handleSubmit(onPetInfoSubmit)}
              >
                Save
              </Button>
            </Grid>

            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                disabled={!isDirty || isSubmitting}
                onClick={onButtonResetClick}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {isLoading || isFetching ? (
        <Box>Loading...</Box>
      ) : (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FormTextField name="name" label="Name" control={control} required />
          </Grid>
          <Grid item xs={6}>
            <FormTextField name="nickName" label="Nick Name" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormDatePicker
              name="dateOfBirth"
              label="Date of Birth"
              actionBarActions={["today", "clear"]}
              control={control}
            />
          </Grid>
          <Grid item xs={6}>
            <FormDatePicker
              name="dateOfAdoption"
              label="Date of Adoption"
              actionBarActions={["today", "clear"]}
              control={control}
            />
          </Grid>
          <Grid item xs={6}>
            <FormSelect
              name={"gender"}
              label={"Gender"}
              control={control}
              options={[
                { value: "Unknown", label: "Unknown" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField name="species" label="Species" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormTextField name="breed" label="Breed" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormTextField name="color" label="Color" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              name="weight"
              label="Weight"
              control={control}
              InputProps={{
                endAdornment: getValues("weightUnit"),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormRadioGroup
              name="weightUnit"
              label="Weight Unit"
              control={control}
              options={[
                { value: "lb", label: "lb" },
                { value: "kg", label: "kg" },
              ]}
              row
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              name="height"
              label="Height"
              control={control}
              InputProps={{
                endAdornment: getValues("heightUnit"),
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <FormRadioGroup
              name="heightUnit"
              label="Height Unit"
              control={control}
              options={[
                { value: "in", label: "in" },
                { value: "cm", label: "cm" },
              ]}
              row
            />
          </Grid>
        </Grid> // Grid container
      )}
    </Box>
  );
};

// export default
export default Info;
