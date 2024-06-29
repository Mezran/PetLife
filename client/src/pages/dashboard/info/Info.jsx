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
// Redux
import { useSelector } from "react-redux";
import { usePetGetOneQuery } from "../../../redux/pet/petApiSlice.js";
// React Hook Form, yup, resolver
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// components
import FormTextField from "../../../components/forms/FormTextField";

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
    // age: yup.number().required("Age is required"),
  });
  // - defaultValues
  const defaultValues = {
    name: selectedPet_id != null && !isFetching ? petData?.pet?.name : "",
    // age: petData?.pet.age || 0,
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
    values: defaultValues,
    // defaultValues: defaultValues,
  });
  // onXXSubmit
  const onPetInfoSubmit = (data) => {
    console.log(data);
  };

  const onButtonResetClick = () => {
    reset();
  };

  // return () {}
  return (
    <Box>
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
        </Grid>
      )}
    </Box>
  );
};

// export default
export default Info;
