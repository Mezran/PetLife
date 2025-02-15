// imports
// Material UI
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Grid,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
// React Router Dom
// Redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedPet_id } from "../../redux/pet/petSlice";
import { usePetGetAllQuery } from "../../redux/pet/petApiSlice";

// React Hook Form, yup, resolver
// components

// const FileName
const Sidebar = (props) => {
  // local state
  // React Router Dom
  // Redux
  const dispatch = useDispatch();
  const selectedPetId = useSelector((state) => state.pet.selectedPet_id);
  const { data, error, isLoading, isFetching } = usePetGetAllQuery();

  // React Hook Form
  // - schema
  // - defaultValues
  // - const {} = useForm;
  // onXXSubmit
  const onPetListItemClicked = (pet_id) => {
    dispatch(setSelectedPet_id(pet_id));
  };

  const onNewPetButtonClicked = () => {
    dispatch(setSelectedPet_id(null));
  };
  // return () {}
  return (
    <Box>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: props.drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: props.drawerWidth, boxSizing: "border-box" },
        }}
      >
        {/* spacer */}
        <Toolbar />

        {/* top app bar */}
        <AppBar position="static" color="transparent" elevation={1}>
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs />
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onNewPetButtonClicked()}
                >
                  New Pet
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/* pet list */}
        {isLoading || isFetching ? (
          <Box>Loading Sidebar...</Box>
        ) : error ? (
          <Box>Error: {error}</Box>
        ) : (
          <Box>
            <List disablePadding>
              {data.pets.map((pet, index) => (
                <Box key={pet._id}>
                  {index === 0 && <Divider />}

                  <ListItem
                    alignItems="flex-start"
                    disablePadding
                    secondaryAction={
                      <IconButton edge="end">{/* <MoreVertIcon /> */}</IconButton>
                    }
                  >
                    <ListItemButton
                      selected={selectedPetId === pet._id}
                      onClick={() => {
                        onPetListItemClicked(pet._id);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar alt={pet.name} src={pet.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${pet.name}`}
                        secondary={`${pet.breed ? pet.breed : "unknown breed"}`}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Box>
              ))}
            </List>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

// export default
export default Sidebar;
