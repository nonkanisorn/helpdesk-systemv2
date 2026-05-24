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
import { hasAnyPermission } from "../auth/permissions";

const ManagerRoute = () => {
  const user = useSelector((state) => state.user);

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyPermission(user.permissions, ["view_all_ticket", "assign_ticket"])) {
    return <Notfound404 statusCode={403} />;
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
