import react, { useState } from "react";
import { Box, Divider, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { hasAnyPermission, hasPermission } from "../../auth/permissions";

const Headerbaradmin = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const permissions = useSelector((state) => state.user.permissions);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispart = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    dispart(logout());
    navigate("/login");
  };
  return (
    <Box
      component={Paper}
      display="flex"
      justifyContent="right"
      p={2}
      sx={{ bgcolor: "#ffffff" }}
    >
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
            {hasPermission(permissions, "view_assigned_ticket") && (
              <Link to="/technician/index" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>🛠️ ไปที่ระบบงานช่าง</MenuItem>
              </Link>
            )}
            {hasAnyPermission(permissions, ["assign_ticket", "view_all_ticket"]) && (
              <Link to="/manager/index" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>📋 ไปที่ระบบจัดการ/จ่ายงาน</MenuItem>
              </Link>
            )}
            {hasAnyPermission(permissions, ["create_ticket", "view_own_ticket"]) && (
              <Link to="/user" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>📝 ไปที่ระบบแจ้งซ่อมทั่วไป</MenuItem>
              </Link>
            )}
            {(hasPermission(permissions, "view_assigned_ticket") ||
              hasAnyPermission(permissions, ["assign_ticket", "view_all_ticket", "create_ticket"])) && (
              <Divider />
            )}
            <Link to="/profile" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>
            <Link to="/login" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Link>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Headerbaradmin;
