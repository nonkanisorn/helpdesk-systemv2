import react, { useState } from "react";
import { Box, Divider, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { hasAnyPermission, hasPermission } from "../../auth/permissions";

const Headerbartech = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const permissions = useSelector((state) => state.user.permissions);
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
            {hasAnyPermission(permissions, ["create_ticket", "view_own_ticket"]) && (
              <Link to="/user" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>📝 ไปที่ระบบแจ้งซ่อมทั่วไป</MenuItem>
              </Link>
            )}
            {hasAnyPermission(permissions, ["assign_ticket", "view_all_ticket"]) && (
              <Link to="/manager/index" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>📋 ไปที่ระบบจัดการ/จ่ายงาน</MenuItem>
              </Link>
            )}
            {hasAnyPermission(permissions, ["manage_users", "manage_roles", "manage_departments"]) && (
              <Link to="/admin/index" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>⚙️ ไปที่ระบบผู้ดูแลระบบ</MenuItem>
              </Link>
            )}
            {(hasAnyPermission(permissions, ["create_ticket", "view_own_ticket", "assign_ticket", "view_all_ticket", "manage_users"])) && (
              <Divider />
            )}
            <Link to="/profile" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>
            <Link to="/login" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
              <MenuItem onClick={handlelogout}>Logout</MenuItem>
            </Link>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Headerbartech;
