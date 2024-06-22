import React from "react";

// imports
// Material UI
import { AppBar, Box, Button, Drawer, Grid, Toolbar } from "@mui/material";
// React Router Dom
// Redux
// React Hook Form, yup, resolver, and devtool
// components

// const FileName
const Sidebar = (props) => {
  // local state
  // React Router Dom
  // Redux
  // React Hook Form
  // - schema
  // - defaultValues
  // - const {} = useForm;
  // onXXSubmit
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
                <Button variant="contained" color="primary" onClick={() => null}>
                  New Pet
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Drawer>
    </Box>
  );
};

// export default
export default Sidebar;
