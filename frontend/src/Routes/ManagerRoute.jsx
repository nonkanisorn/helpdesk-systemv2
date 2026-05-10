// import React from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import Sidebarmanager from "../layout/manager/Sidebarmanager";
// import Headerbarmanager from "../layout/manager/Headerbarmanager";
// import { Box } from "@mui/material";
// import Reportcase from "../components/Manager/Reportcase";
// import { Detailcase as DetailTicketManager } from "../components/Manager/Detailcase";
// import Adduser from "../components/Manager/Adduser";
// import { useSelector } from "react-redux";
// import Managerpages from "../components/Manager/Managerpages";
// import { useEffect } from "react";
// import Notfound404 from "../components/Notfound404";
// import Statuscase from "../components/Manager/Statuscase";
// import casedetailstatus from "../components/Manager/Casedetailstatus";
// import Historydevice from "../components/Manager/ManageDevice";
// import Devicehistory from "../components/Manager/Devicehistory";
// import ManageDevice from "../components/Manager/ManageDevice";
// import DeviceDetailPages from "../components/Manager/DeviceDetailPages";
// import InstanceDeviceHistoryPage from "../components/Manager/InstanceDeviceHistoryPage";
// import Detailcase from "../components/Detailcase";
// const ManagerRoute = () => {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => ({ ...state }));
//   console.log("manager", user);
//   useEffect(() => {
//     if (!user || !user.token) {
//       navigate("/login");
//     }
//   }, [user, navigate]);
//   const text = "No permission";
//   return user && user.token && user.role_id === 2 ? (
//     <div className="app">
//       <Sidebarmanager />
//       <main className="content" style={{ backgroundColor: "#F5F6Fa" }}>
//         <Headerbarmanager />
//         <Box>
//           <Box m="20px">
//             <Routes>
//               <Route path="index" element={<Managerpages />} />
//               <Route path="reportticket" element={<Reportcase />} />
//               <Route
//                 path="ticket/assign/:ticket_id"
//                 element={<DetailTicketManager />}
//               />
//               <Route path="detail/:ticket_id" element={<Detailcase />} />
//               <Route path="adduser" element={<Adduser />} />
//               <Route path="statusticket" element={<Statuscase />} />
//               <Route path="manage/device" element={<ManageDevice />} />
//               <Route
//                 path="instance/:instance_id/history"
//                 element={<InstanceDeviceHistoryPage />}
//               />
//               <Route
//                 path="manage/device/:dev_id/instances"
//                 element={<DeviceDetailPages />}
//               />
//               <Route
//                 path="device/history/:dev_id"
//                 element={<Devicehistory />}
//               />
//               <Route path="ticketdetail/:ticket_id" element={<Detailcase />} />
//               <Route path="*" element={<Notfound404 />} />
//             </Routes>
//           </Box>
//         </Box>
//       </main>
//     </div>
//   ) : (
//     <Notfound404 text={text} />
//   );
// };
//
// export default ManagerRoute;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import Sidebarmanager from "../layout/manager/Sidebarmanager";
import Headerbarmanager from "../layout/manager/Headerbarmanager";
import Reportcase from "../components/Manager/Reportcase";
import { Detailcase as DetailTicketManager } from "../components/Manager/Detailcase";
import Adduser from "../components/Manager/Adduser";
import Managerpages from "../components/Manager/Managerpages";
import Notfound404 from "../components/Notfound404";
import Statuscase from "../components/Manager/Statuscase";
import Devicehistory from "../components/Manager/Devicehistory";
import ManageDevice from "../components/Manager/ManageDevice";
import DeviceDetailPages from "../components/Manager/DeviceDetailPages";
import InstanceDeviceHistoryPage from "../components/Manager/InstanceDeviceHistoryPage";
import Detailcase from "../components/Detailcase";

const ManagerRoute = () => {
  const user = useSelector((state) => state.user);

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role_id !== 2) {
    return <Notfound404 text="No permission" />;
  }

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        bgcolor: "#F5F6Fa",
        overflow: "hidden",
      }}
    >
      <Sidebarmanager />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "#F5F6Fa",
        }}
      >
        <Headerbarmanager />

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            p: { xs: 2, sm: 3 },
            pb: {
              xs: "calc(96px + env(safe-area-inset-bottom))",
              sm: 6,
            },
            boxSizing: "border-box",
          }}
        >
          <Routes>
            <Route path="index" element={<Managerpages />} />
            <Route path="reportticket" element={<Reportcase />} />
            <Route
              path="ticket/assign/:ticket_id"
              element={<DetailTicketManager />}
            />
            <Route path="detail/:ticket_id" element={<Detailcase />} />
            <Route path="adduser" element={<Adduser />} />
            <Route path="statusticket" element={<Statuscase />} />
            <Route path="manage/device" element={<ManageDevice />} />
            <Route
              path="instance/:instance_id/history"
              element={<InstanceDeviceHistoryPage />}
            />
            <Route
              path="manage/device/:dev_id/instances"
              element={<DeviceDetailPages />}
            />
            <Route path="device/history/:dev_id" element={<Devicehistory />} />
            <Route path="ticketdetail/:ticket_id" element={<Detailcase />} />
            <Route path="*" element={<Notfound404 />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerRoute;
