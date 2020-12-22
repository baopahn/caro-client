import {
  AppBar,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Grid,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../assert/img/caro-logo.png";
import useStyles from "./styles";
import SettingsIcon from "@material-ui/icons/Settings";
import SignIn from "../signIn";
import { connect } from "react-redux";
import action from "../../storage/action";
import realtime from "../../realtime";

const ITEM_HEIGHT = 48;

const Navbar = ({ token, setToken }) => {
  // Styles
  const classes = useStyles();

  // React router hook
  const history = useHistory();

  // States
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Setups
  const _handleClickOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const _handleClickCloseMenu = () => {
    setAnchorEl(null);
  };

  const _handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const _handleClickCloseDialog = () => {
    setOpenDialog(false);
  };

  const _handleClickSignOut = () => {
    const token = localStorage.getItem("token");
    realtime.signOut(token);

    localStorage.removeItem("token");
    setToken(null);
    _handleClickCloseMenu();
  };

  const _handleClickProfile = () => {
    _handleClickCloseMenu();
    history.push(`/profile`);
  };

  const _handleClickChangePassword = () => {
    _handleClickCloseMenu();
    history.push(`/change-password`);
  };

  // Component didmount
  useEffect(() => {
    if (typeof localStorage.getItem("token") !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const open = Boolean(anchorEl);
  const menu =
    token === null ? (
      <>
        <Button
          variant="button"
          color="textPrimary"
          className={classes.link}
          onClick={_handleClickOpenDialog}
        >
          Sign in
        </Button>
      </>
    ) : (
      <>
        <IconButton
          className={classes.iconButton}
          onClick={_handleClickOpenMenu}
        >
          <SettingsIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={_handleClickCloseMenu}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem onClick={_handleClickProfile}>Profile</MenuItem>
          <MenuItem onClick={_handleClickChangePassword}>
            Change password
          </MenuItem>
          <MenuItem onClick={_handleClickSignOut}>Sign out</MenuItem>
        </Menu>
      </>
    );

  return (
    <>
      {token === null ? (
        <SignIn open={openDialog} onClose={_handleClickCloseDialog} />
      ) : (
        <></>
      )}

      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Grid container>
            <Grid item md={1} xs={0}></Grid>
            <Grid container item md={10} xs={12}>
              <Grid item md={6} xs={6}>
                <Typography className={classes.toolbarTitle}>
                  <Link to={"/"}>
                    <Button>
                      <img src={Logo} alt="logo" className={classes.logo} />
                    </Button>
                  </Link>
                </Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <nav
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {menu}
                </nav>
              </Grid>
            </Grid>
            <Grid item md={1} xs={0}></Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => {
    dispatch(action.TOKEN.update(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
