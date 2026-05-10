import react, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
const Headerbaruser = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispart = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispart(logout());
    navigate("/login");
    window.location.reload();
  };
  return (
    <Box component={Paper} display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" fontWeight="fontWeightBold">
          HELPDESK APP
        </Typography>
        <Stack direction="row" spacing={2} sx={{ ml: 2 }}>
          <Link to={{ pathname: "/user" }}>หน้าหลัก</Link>
          <Link to={{ pathname: "/user/repair-request" }}>แจ้งซ่อม</Link>
          <Link to={{ pathname: "/user/repair-history" }}>
            ติดตามสถานะ/ประวัติของฉัน
          </Link>
        </Stack>
      </Box>
      {/* icons */}
      <Box display="flex">
        <IconButton>
          <AccountCircleIcon onClick={handleMenu} />
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
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Link>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Headerbaruser;
