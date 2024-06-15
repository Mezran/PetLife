// imports
import { useState } from "react";
// Material UI
import {
  AppBar,
  Box,
  Toolbar,
  Grid,
  Button,
  Typography,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
// React Router Dom
import { Link as RRDLink, useNavigate } from "react-router-dom";
// Redux
import { useSelector } from "react-redux";
import {
  useUserGetSessionQuery,
  useUserLogoutMutation,
} from "../../redux/user/userApiSlice";
// React Hook Form, yup, resolver, and devtool
// components

// const FileName
const Header = () => {
  // local state
  const [avatarAnchorElement, setAvatarAnchorElement] = useState(null);
  // React Router Dom
  const navigate = useNavigate();
  // Redux
  const { isLoading, isFetching } = useUserGetSessionQuery();
  const user = useSelector((state) => state.user.user);

  const [userLogout] = useUserLogoutMutation();

  // React Hook Form
  // - schema
  // - defaultValues
  // - const {} = useForm;
  // onXXSubmit
  const handleAvatarOnClick = (event) => {
    setAvatarAnchorElement(event.currentTarget);
  };
  const handleAvatarOnClose = () => {
    setAvatarAnchorElement(null);
  };
  const handleProfileOnClick = () => {
    handleAvatarOnClose();
    navigate("/user/profile");
  };
  const handleLogoutOnClick = async () => {
    handleAvatarOnClose();
    userLogout();
  };

  // return () {}
  if (isLoading || isFetching) return <Box>Loading...</Box>;
  return (
    <>
      <AppBar color="primary" position="fixed" elevation={4}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            {/* Pet Icon */}
            <Grid item>
              <PetsIcon />
            </Grid>
            {/* Pet Life Title */}
            <Grid item>
              <Typography
                variant="h6"
                component={RRDLink}
                to="/"
                paddingX={2}
                style={{ textDecoration: "none", color: "white" }}
              >
                Home Page
              </Typography>
            </Grid>
            <Grid item>
              {/* Dashboard Button */}
              {/* if user is logged in, show the dashboard button */}
              {user != null && (
                <Button component={RRDLink} to={"/dashboard"} sx={{ color: "white" }}>
                  Dashboard
                </Button>
              )}
            </Grid>

            {/* pushes the avatar to the right */}
            <Grid item xs />
            {/* User button */}
            <Grid item>
              {/* if user is logged in, show the logout button */}
              {user != null ? (
                <Button onClick={handleAvatarOnClick}>
                  <Avatar>{user.username.at(0).toUpperCase()}</Avatar>
                </Button>
              ) : (
                <Button component={RRDLink} to={"/user/login"} sx={{ color: "white" }}>
                  Login
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
        {/* avatar */}
        <Menu
          anchorEl={avatarAnchorElement}
          open={Boolean(avatarAnchorElement)}
          onClose={handleAvatarOnClose}
        >
          <MenuItem onClick={handleProfileOnClick}>Profile</MenuItem>

          <MenuItem onClick={handleLogoutOnClick}>Logout</MenuItem>
        </Menu>
      </AppBar>
      {/* this toolbar provides spacing for content below the app bar */}
      <Toolbar />
    </>
  );
};
// export default
export default Header;
