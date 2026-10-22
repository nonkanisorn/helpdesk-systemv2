//
// import React, { useEffect, useState } from "react";
//
// import axios from "axios";
// import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import { Box, IconButton, Typography, useTheme, Badge } from "@mui/material";
// import { Link } from "react-router-dom";
//
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
// import TableViewIcon from "@mui/icons-material/TableView";
// import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
// import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
// import { useSelector } from "react-redux";
//
// const Sidebartech = () => {
//   const [isCollapsed, setisCollapsed] = useState(false);
//   const [toggled, setToggled] = useState(false);
//   const [broken, setBroken] = useState(false);
//   const full_name = useSelector((state) => state.user.full_name);
//
//   const user_id = useSelector((state) => state.user.user_id);
//   const [url, setUrl] = useState("");
//
//   useEffect(() => {
//     if (user_id) {
//       const fetchdata = async () => {
//         const response = await axios.get(
//           `http://localhost:5011/users/${user_id}`,
//         );
//         if (
//           !response.data[0].user_img ||
//           response.data[0].user_img.data.length === 0
//         ) {
//           setUrl("/assets/user.png");
//         } else {
//           const user = response.data[0];
//           const array = new Uint8Array(user.user_img.data);
//           const blob = new Blob([array], { type: "image/jpeg" });
//           const url = URL.createObjectURL(blob);
//           setUrl(url);
//         }
//       };
//
//       fetchdata();
//     }
//   }, [user_id]);
//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100%",
//       }}
//     >
//       <Sidebar
//         collapsed={isCollapsed}
//         toggled={toggled}
//         onBackdropClick={() => setToggled(false)}
//         onBreakPoint={setBroken}
//         // image="/assets/123.jpg"
//         backgroundColor="#234"
//         breakPoint="md"
//         style={{ height: "100%" }}
//       >
//         <div
//           style={{ display: "flex", flexDirection: "column", height: "100%" }}
//         >
//           <div style={{ flex: 1, marginBottom: "32px" }}>
//             <Menu iconShape="square">
//               {/* LOGO */}
//               <MenuItem
//                 onClick={() => setisCollapsed(!isCollapsed)}
//                 icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//                 style={{
//                   margin: "10px 0 20px 0",
//                 }}
//               >
//                 {!isCollapsed && (
//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     ml="15px"
//                   >
//                     <Typography sx={{ color: "white" }}>
//                       HELPDESK APP
//                     </Typography>
//                     <IconButton onClick={() => setisCollapsed(!isCollapsed)}>
//                       <MenuOutlinedIcon sx={{ color: "white" }} />
//                     </IconButton>
//                   </Box>
//                 )}
//               </MenuItem>
//               {!isCollapsed && (
//                 <Box mb="25px">
//                   <Box
//                     display="flex"
//                     justifyContent="center"
//                     alignItems="center"
//                   >
//                     <img
//                       width="100px"
//                       height="100px"
//                       src={url}
//                       style={{ cursor: "pointer", borderRadius: "50%" }}
//                     />
//                   </Box>
//                   <Box textAlign="center">
//                     <Typography sx={{ m: "10px 0 0 0", color: "white" }}>
//                       {full_name}
//                     </Typography>
//                   </Box>
//                 </Box>
//               )}
//               <Link to="/technician/index" className="menu-bars">
//                 <MenuItem style={{ color: "#fff" }} icon={<HomeOutlinedIcon />}>
//                   หน้าหลัก
//                 </MenuItem>
//               </Link>
//               <Link to="/technician/reporttickettech" className="menu-bars">
//                 <MenuItem
//                   style={{ color: "#fff" }}
//                   icon={<ConstructionOutlinedIcon />}
//                 >
//                   งานที่ได้รับมอบหมาย
//                 </MenuItem>
//               </Link>
//               <Link to="/technician/Historyticket" className="menu-bars">
//                 <MenuItem
//                   style={{ color: "#fff" }}
//                   icon={<HistoryToggleOffIcon />}
//                 >
//                   ประวัติการซ่อม
//                 </MenuItem>
//               </Link>
//               <Link to="/technician/device" className="menu-bars">
//                 <MenuItem
//                   style={{ color: "#fff" }}
//                   icon={<HistoryToggleOffIcon />}
//                 >
//                   จัดการอุปกรณ์
//                 </MenuItem>
//               </Link>
//             </Menu>
//           </div>
//         </div>
//       </Sidebar>
//       <main>
//         <div style={{ padding: "16px 2px ", color: "#44596e" }}>
//           <div style={{ marginBottom: "16px" }}>
//             {broken && (
//               <IconButton onClick={() => setToggled(!toggled)}>
//                 <MenuOutlinedIcon />
//               </IconButton>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };
// export default Sidebartech;
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileInitialsAvatar from "../ProfileInitialsAvatar";
import { hasAnyPermission, hasPermission } from "../../auth/permissions";
import { formatRoleName } from "../../auth/roleUtils";

/* ICONS */
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const Sidebartech = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  const location = useLocation();

  const firstName = useSelector((state) => state.user.first_name);
  const lastName = useSelector((state) => state.user.last_name);
  const roleName = useSelector((state) => state.user.role_name);
  const roleId = useSelector((state) => state.user.role_id);
  const permissions = useSelector((state) => state.user.permissions);
  const full_name = `${firstName ?? ""} ${lastName ?? ""}`.trim() || "-";
  const displayRole = formatRoleName(roleName, roleId);

  const menuItems = [
    {
      title: "หน้าหลัก",
      path: "/technician/index",
      icon: <HomeOutlinedIcon />,
    },
    {
      title: "งานที่ได้รับมอบหมาย",
      path: "/technician/reporttickettech",
      icon: <AssignmentOutlinedIcon />,
      permission: "view_assigned_ticket",
    },
    {
      title: "ประวัติการซ่อม",
      path: "/technician/Historyticket",
      icon: <HistoryToggleOffIcon />,
      permission: "view_assigned_ticket",
    },
    {
      title: "จ่ายงาน / มอบหมายงาน",
      path: "/manager/reportticket",
      icon: <AssignmentTurnedInIcon />,
      permission: "assign_ticket",
    },
    {
      title: "แจ้งซ่อมอุปกรณ์",
      path: "/user/repair-request",
      icon: <AddCircleOutlineIcon />,
      permission: "create_ticket",
    },
    {
      title: "งานแจ้งซ่อมของฉัน",
      path: "/user/repair-history",
      icon: <FormatListBulletedIcon />,
      permission: "view_own_ticket",
    },
    {
      title: "จัดการอุปกรณ์",
      path: "/technician/device",
      icon: <DevicesOutlinedIcon />,
      permissions: ["view_devices", "manage_devices"],
    },
  ];
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.permission) return hasPermission(permissions, item.permission);
    if (item.permissions) return hasAnyPermission(permissions, item.permissions);
    return true;
  });

  return (
    <Box
      sx={{
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
        backgroundColor="#ffffff"
        rootStyles={{
          height: "100%",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              height: "70px",
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "space-between",
              px: isCollapsed ? 0 : 2,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {!isCollapsed && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SettingsOutlinedIcon
                    sx={{
                      color: "white",
                      fontSize: "18px",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: "17px",
                    letterSpacing: "-0.4px",
                  }}
                >
                  Helpdesk
                </Typography>
              </Box>
            )}

            <IconButton
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{
                color: "#64748b",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>

          {/* PROFILE */}
          {!isCollapsed && (
            <Box
              sx={{
                p: 2,
                mx: 2,
                mt: 2,
                borderRadius: "18px",
                backgroundColor: "#f8fafc",
                border: "1px solid #eef2f7",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <ProfileInitialsAvatar size={48} />

                <Box>
                  <Typography
                    sx={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {full_name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    {displayRole}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* MENU */}
          <Box sx={{ mt: 2 }}>
            <Menu
              menuItemStyles={{
                button: ({ active }) => ({
                  color: active ? "#2563eb" : "#475569",
                  backgroundColor: active ? "#eff6ff" : "transparent",
                  borderRadius: "12px",
                  margin: "6px 12px",
                  height: "48px",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 500,
                  transition: "all 0.2s ease",

                  "&:hover": {
                    backgroundColor: "#f8fafc",
                    color: "#2563eb",
                  },
                }),

                icon: ({ active }) => ({
                  color: active ? "#2563eb" : "#94a3b8",
                }),
              }}
            >
              {visibleMenuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  active={location.pathname === item.path}
                  icon={item.icon}
                  component={<Link to={item.path} />}
                >
                  {item.title}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Sidebar>

      {/* MOBILE BUTTON */}
      <Box component="main">
        {broken && (
          <IconButton
            onClick={() => setToggled(!toggled)}
            sx={{
              m: 2,
              backgroundColor: "white",
              border: "1px solid #e2e8f0",

              "&:hover": {
                backgroundColor: "#f8fafc",
              },
            }}
          >
            <MenuOutlinedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Sidebartech;
