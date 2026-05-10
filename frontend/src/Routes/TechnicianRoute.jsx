import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import Notfound404 from "../components/Notfound404";
import TechnicianPage from "../components/technician/TechnicianPage";
import Reportcasetech from "../components/technician/Reportcasetech";
import Sidebartech from "../layout/tech/Sidebartech";
import Headerbartech from "../layout/tech/Headerbartech";
import Detailcasetech from "../components/technician/Detailcasetech";
import Histoyrycase from "../components/technician/Historycase";
import Detailcasetechfinish from "../components/technician/Detailcasetechfinish";
import Managedevice from "../components/technician/Managedevice.jsx";
import DeviceDetailPages from "../components/technician/DeviceDetailPages";
import Detailcase from "../components/Detailcase";
import InstanceDeviceHistoryPage from "../components/technician/InstanceDeviceHistoryPage";

const TechnicianRoute = () => {
  const user = useSelector((state) => state.user);

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role_id !== 3) {
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
      <Sidebartech />

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
        <Headerbartech />

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
            <Route path="index" element={<TechnicianPage />} />
            <Route path="repairs/:ticket_id" element={<Detailcase />} />
            <Route path="reporttickettech" element={<Reportcasetech />} />
            <Route path="device" element={<Managedevice />} />
            <Route
              path="device/detail/:dev_id"
              element={<DeviceDetailPages />}
            />
            <Route
              path="instance/:instance_id/history"
              element={<InstanceDeviceHistoryPage />}
            />
            <Route
              path="ticket/:ticket_id/repair"
              element={<Detailcasetech />}
            />
            <Route
              path="detailtickettechfinish/:ticket_id"
              element={<Detailcasetechfinish />}
            />
            <Route path="historyticket" element={<Histoyrycase />} />
            <Route path="*" element={<Notfound404 />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default TechnicianRoute;
