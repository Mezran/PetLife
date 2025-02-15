// imports
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
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTab } from "../../redux/dashboard/dashboardSlice";
import { usePetGetOneQuery, usePetGetAllQuery } from "../../redux/pet/petApiSlice";
// React Hook Form, yup, resolver

// components
import Sidebar from "./Sidebar";
import InfoDemo from "./info/Info";

// const FileName
const PageDashboard = () => {
  const dispatch = useDispatch();
  // local state
  const drawerWidth = 280;
  const selectedTab = useSelector((state) => state.dashboard.selectedTab);
  const selectedPet_id = useSelector((state) => state.pet.selectedPet_id);
  const {
    data: petListData,
    error: petListError,
    isLoading: petListIsLoading,
    isFetching: petListIsFetching,
  } = usePetGetAllQuery();
  const { data, error, isLoading, isFetching } = usePetGetOneQuery(selectedPet_id, {
    skip: selectedPet_id == null,
  });
  // React Router Dom
  // Redux
  // React Hook Form
  // - schema
  // - defaultValues
  // - const {} = useForm;
  // onXXSubmit
  const onTabClicked = (event, tabValue) => {
    dispatch(setSelectedTab(tabValue));
  };
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
            {isLoading || isFetching || petListIsLoading || petListIsFetching ? (
              <Typography>Loading Dashboard...</Typography>
            ) : error || petListError ? (
              <Typography>Error...</Typography>
            ) : (
              <>
                <AppBar
                  component="div"
                  color="transparent"
                  position="static"
                  elevation={1}
                  sx={{ zIndex: 0 }}
                >
                  <Toolbar>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item xs>
                        <Typography color="inherit" variant="h5" component="h1">
                          {selectedPet_id ? data?.pet.name : "New Pet"}
                        </Typography>
                      </Grid>
                      <Grid item xs />
                    </Grid>
                  </Toolbar>
                </AppBar>
                {/* Tab Control */}
                <Tabs value={selectedTab} onChange={onTabClicked}>
                  <Tab label="Overview" value="overview" />
                  <Tab label="Info" value="info" />
                  <Tab label="Tab 2" value="tab2" />
                </Tabs>
                <Divider />

                {/* Tab Content */}
                <Box>
                  <Box p={2} hidden={selectedTab !== "overview"}>
                    Overview
                  </Box>
                  <Box p={2} hidden={selectedTab !== "info"}>
                    <InfoDemo />
                  </Box>
                  <Box p={2} hidden={selectedTab !== "tab2"}>
                    Tab 2
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
// export default
export default PageDashboard;
