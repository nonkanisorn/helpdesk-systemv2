import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import { useSelector } from "react-redux";
const Sidebaruser = () => {
  const [isCollapsed, setisCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const full_name = useSelector((state) => state.user.full_name);
  const user_id = useSelector((state) => state.user.user_id);
  const [url, setUrl] = useState("");
  const [checkurl, setcheckurl] = useState("");

  useEffect(() => {
    if (user_id) {
      const fetchdata = async () => {
        const response = await axios.get(
          `http://localhost:5011/users/${users_id}`,
        );
        if (
          !response.data[0].user_img ||
          response.data[0].user_img.data.length === 0
        ) {
          setUrl("/assets/user.png");
          setcheckurl(response.data);
        } else {
          const user = response.data[0];
          const array = new Uint8Array(user.user_img.data);
          const blob = new Blob([array], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setUrl(url);
        }
      };

      fetchdata();
    }
  }, [user_id]);
  useEffect(() => {}, [url]);
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
                    <img
                      alt="profile-user"
                      width="100px"
                      height="100px"
                      src={url}
                      style={{ cursor: "pointer", borderRadius: "50%" }}
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
