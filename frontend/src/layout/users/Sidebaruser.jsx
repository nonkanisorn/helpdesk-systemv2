import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import { useSelector } from "react-redux";
import ProfileInitialsAvatar from "../ProfileInitialsAvatar";
const Sidebaruser = () => {
  const [isCollapsed, setisCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const firstName = useSelector((state) => state.user.first_name);
  const lastName = useSelector((state) => state.user.last_name);
  const full_name = `${firstName ?? ""} ${lastName ?? ""}`.trim() || "-";
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <Sidebar
        collapsed={isCollapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        backgroundColor="#234"
        style={{ height: "100%" }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <Menu iconShape="square">
              {/* LOGO */}
              <MenuItem
                onClick={() => setisCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                    color="#fff"
                  >
                    <Typography>HELPDESK </Typography>
                    <IconButton onClick={() => setisCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
              {!isCollapsed && (
                <Box mb="25px">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ProfileInitialsAvatar
                      size={96}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                  <Box textAlign="center">
                    <Typography sx={{ m: "10px 0 0 0", color: "#fff" }}>
                      {full_name}
                    </Typography>
                  </Box>
                </Box>
              )}
              <Link to="/user/index" className="menu-bars">
                <MenuItem style={{ color: "#fff" }} icon={<HomeOutlinedIcon />}>
                  หน้าหลัก
                </MenuItem>
              </Link>
              <Link to="/user/Addticket" className="menu-bars">
                <MenuItem
                  style={{ color: "#fff" }}
                  icon={<ConstructionOutlinedIcon />}
                >
                  แจ้งซ่อม
                </MenuItem>
              </Link>
              <Link to="/user/statusticket" className="menu-bars">
                <MenuItem
                  style={{ color: "#fff" }}
                  icon={<ConstructionOutlinedIcon />}
                >
                  สถานะการแจ้งซ่อม
                </MenuItem>
              </Link>
              <Link to="/user/Historyrepair" className="menu-bars">
                <MenuItem
                  style={{ color: "#fff" }}
                  icon={<HistoryToggleOffIcon />}
                >
                  ประวัติการแจ้งซ่อม
                </MenuItem>
              </Link>
            </Menu>
          </div>
        </div>
      </Sidebar>
      <main>
        <div style={{ padding: "16px 2px ", color: "#44596e" }}>
          <div style={{ marginBottom: "16px" }}>
            {broken && (
              <IconButton onClick={() => setToggled(!toggled)}>
                <MenuOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Sidebaruser;
