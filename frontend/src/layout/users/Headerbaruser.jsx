import react, { useState } from "react";
import {
  Box,
  Divider,
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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { hasAnyPermission, hasPermission } from "../../auth/permissions";

const Headerbaruser = () => {
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
            {hasAnyPermission(permissions, ["manage_users", "manage_roles", "manage_departments"]) && (
              <Link to="/admin/index" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>⚙️ ไปที่ระบบผู้ดูแลระบบ</MenuItem>
              </Link>
            )}
            {(hasPermission(permissions, "view_assigned_ticket") ||
              hasAnyPermission(permissions, ["assign_ticket", "view_all_ticket", "manage_users"])) && (
              <Divider />
            )}
            <Link to="/profile" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>
            <Link to="/login" className="menu-bars" style={{ textDecoration: "none", color: "inherit" }}>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Link>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Headerbaruser;
