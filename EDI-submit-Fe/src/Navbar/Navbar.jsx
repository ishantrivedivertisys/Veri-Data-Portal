import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Grid,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaUpload } from "react-icons/fa";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneySharpIcon from "@mui/icons-material/AttachMoneySharp";
import AlternateEmailSharpIcon from "@mui/icons-material/AlternateEmailSharp";
import StyledDropzone from "../components/ImportHistory/Components/StyledDropzone.jsx";
import { useCheckPermission } from "../utils/PermissionHelpers.jsx";
import {
  aliasesScreen,
  uploadTradeTape,
  currencyExchange,
} from "../utils/PermissionsConstants.jsx";
import { setErrorTempConfig } from "../redux/features/experienceSlice.js";
import { AppRoute } from "../app/AppRoute.jsx";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";

const Navbar = () => {
  const showUploadbuttonPermission = useCheckPermission(uploadTradeTape);
  const showCurrencyExchange = useCheckPermission(currencyExchange);
  const showAliasesPermission = useCheckPermission(aliasesScreen);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { modalState } = useSelector((state) => state.experience);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const settings = [
    {
      label: "Logout",
      icon: <LogoutIcon />,
      onClick: () => {
        localStorage.clear();
        navigate(AppRoute.home);
      },
    },
  ];

  const pages = [
    {
      label: "Home",
      icon: <HomeIcon />,
      path: AppRoute.importHistory,
      onClick: () => {
        dispatch(setErrorTempConfig([]));
        navigate(AppRoute.importHistory);
      },
    },
    showUploadbuttonPermission && {
      label: "Upload",
      path: "#",
      icon: <FaUpload style={{ width: "15px", height: "15px" }} />,
      onClick: openDialog,
    },
    showCurrencyExchange && {
      label: "Currency",
      path: AppRoute.currencyRate,
      icon: <AttachMoneySharpIcon style={{ width: "20px", height: "20px" }} />,
      onClick: () => {
        navigate(AppRoute.currencyRate);
      },
    },
    showAliasesPermission && {
      label: "Aliases",
      path: AppRoute.alias,
      icon: (
        <AlternateEmailSharpIcon style={{ width: "20px", height: "20px" }} />
      ),
      onClick: () => {
        navigate(AppRoute.alias);
      },
    },
    // {
    //   label: "Notes",
    //   icon: <SpeakerNotesIcon />,
    //   onClick: () => {
    //     dispatch(setErrorTempConfig([]));
    //     navigate(AppRoute.processingNotes);
    //   },
    // },
  ];
  useEffect(() => {
    if (!modalState) {
      setDialogOpen(false);
    }
  }, [modalState]);
  return (
    <AppBar
      position="static"
      sx={{
        backgroundImage: "linear-gradient(to right, #010911, #005bb5)",
        height: "50px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        paddingLeft: "0px",
        paddingRight: "0px",
      }}
    >
      <Container
        maxWidth
        sx={{ paddingLeft: "0px !important", paddingRight: "0px !important" }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: "50px !important",
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Section: Logo and Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Logo */}
            <img src="./riemer.png" alt="logo" style={{ height: 40 }} />

            {/* Navigation Links */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {pages.map(
                (page) =>
                  page && (
                    <Button
                      key={page.label}
                      onClick={page.onClick}
                      startIcon={page.icon}
                      sx={{
                        color:
                          location.pathname === page.path
                            ? "#e0f0ff"
                            : "#ffffff",
                        backgroundColor:
                          location.pathname === page.path
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent",
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: 14,
                        padding: "8px 12px",
                        borderRadius: "20px",
                        "&:hover": {
                          color: "#e0f0ff",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          transform: "scale(1.05)",
                          transition: "all 0.3s ease",
                        },
                        ".MuiButton-startIcon": {
                          marginRight:
                            page.label === "Currency" ? "2px" : "8px",
                        },
                      }}
                    >
                      {page.label}
                    </Button>
                  )
              )}
            </Box>
          </Box>

          {/* Right Section: User Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Grid item marginX={2}>
              <Tooltip title="Help">
                <IconButton
                  sx={{
                    color: "white",

                    // padding: "8px 12px",
                    // borderRadius: "20px",
                    "&:hover": {
                      color: "#e0f0ff",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease",
                    },
                  }}
                  onClick={(e) => navigate(AppRoute.help)}
                >
                  <HelpOutlineIcon sx={{ height: "30px", width: "30px" }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Tooltip title="User Settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Riemer"
                  src="/static/images/avatar/2.jpg"
                  sx={{
                    width: 34,
                    height: 34,
                    border: "2px solid #ffffff",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                    backgroundImage:
                      "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                      border: "2px solid #1e90ff",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={setting.onClick}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#2E3B4E",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  {setting.icon}
                  <Typography>{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      {/* Dialog Component */}
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={dialogOpen}
        onClose={closeDialog}
        sx={{ paddingBottom: "20px" }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#def8ed",
            padding: "10px",
            paddingLeft: "24px",
            fontSize: "17px",
          }}
          alignItems={"center"}
          justifyContent={"start"}
          display={"flex"}
        >
          {<img src="./r-white.png" alt="logo" height={"30px"} />}
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              alignItems: "center",
            }}
          >
            Trade Tape Upload
          </span>
        </DialogTitle>
        <DialogContent>
          <StyledDropzone />
        </DialogContent>
        <DialogActions className="py-7" sx={{ padding: "20px" }}>
          <Button onClick={closeDialog} color="error" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
