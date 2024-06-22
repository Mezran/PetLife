// imports
import { useState, useEffect } from "react";
// Material UI
import {
  AppBar,
  Box,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
// React Router Dom
// Redux
import { useSelector } from "react-redux";

// React Hook Form, yup, resolver, and devtool

// components
import Sidebar from "./Sidebar";

// const FileName
const PageDashboard = () => {
  // local state
  const drawerWidth = 280;
  const selectedTab = useSelector((state) => state.dashboard.selectedTab);
  const selectedPet_id = useSelector((state) => state.pet.selectedPet_id);
  // React Router Dom
  // Redux
  // React Hook Form
  // - schema
  // - defaultValues
  // - const {} = useForm;
  // onXXSubmit
  // return () {}
  return (
    <Box display="flex" minHeight="100vh" sx={{ backgroundColor: "#eaeff1" }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ width: `calc(100vw - ${drawerWidth}px)`, flexDirection: "column" }}>
        {/* main section */}
        <Box p={4}>
          <Paper
            sx={{ maxWidth: 936, minHeight: 600, margin: "auto", overflow: "hidden" }}
          >
            {selectedPet_id ? (
              <Typography align="center">Pet ID: {selectedPet_id}</Typography>
            ) : (
              <Typography align="center">No Pet Selected</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
// export default
export default PageDashboard;
