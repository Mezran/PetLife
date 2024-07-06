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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"; // React Router Dom
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
        <Grid container spacing={2}>
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
        </Grid>
      )}
    </Box>
  );
};

// export default
export default Info;
