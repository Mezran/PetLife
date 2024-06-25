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
// React Hook Form, yup, resolver, and devtool
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DevTool } from "@hookform/devtools";

// components
import CTextField from "../../../components/customMUI/cTextField/CTextField.jsx";
import FormTextField from "../../../components/forms/FormTextField";

// const FileName
const Info = () => {
  // local state
  const [isViewState, setIsViewState] = React.useState(true);
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
    name: "",
    // age: selectedPet_id != null ? petData?.pet.age : 0,
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
  });
  // onXXSubmit
  const onPetInfoSubmit = (data) => {
    console.log(data);
  };

  // return () {}
  return (
    <Box>
      <DevTool control={control} placement="top-right" />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography variant="h6" color="inherit">
                Pet Info
              </Typography>
            </Grid>
            {isViewState ? (
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setIsViewState(!isViewState)}
                >
                  Edit
                </Button>
              </Grid>
            ) : (
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setIsViewState(!isViewState)}
                >
                  Cancel
                </Button>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      {isLoading || isFetching ? (
        <Box>Loading...</Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormTextField
              isViewState={isViewState}
              // data={petData?.pet.name}
              name="name"
              label="Name"
              control={control}
              required
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

// export default
export default Info;
