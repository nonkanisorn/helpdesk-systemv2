import react, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";

const Headerbartech = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlelogout = async () => {
    dispatch(logout());
    // navigate('/login')
  };
  return (
    <Box component={Paper} display="flex" justifyContent="right" p={2}>
      {/* search 
      <Box display="flex" borderRadius="3px" backgroundColor="#F5EFE7">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      {/* icons */}
      <Box display="flex">
        <IconButton onClick={handleMenu}>
          <AccountCircleIcon />
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Link to="/profile" className="menu-bars">
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>
            <Link to="/login" className="menu-bars">
              <MenuItem onClick={handlelogout}>Logout</MenuItem>
            </Link>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Headerbartech;
