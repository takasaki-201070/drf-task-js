import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { editLogupt, selectProfile } from "../../views/login/loginSlice";

const useStyles = makeStyles(() => ({
  root: {
    height: "64px",
    display: "flex",
    justifyContent: "left",
  },
  profbox: {
    width: "95%",
    textAlign: "left",
  },
  logoutbtn: {
    width: "5%",
    textAlign: "right",
  },
}));

const TopBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const Logout = () => {
    localStorage.removeItem("localJWT");
    dispatch(editLogupt(false));
  };

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Box className={classes.profbox} textAlign="right">
          <Typography variant="h6">{profile.username}</Typography>
        </Box>
        <Box className={classes.logoutbtn}>
          <IconButton onClick={Logout} color="inherit">
            <ExitToAppIcon fontSize="large" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
