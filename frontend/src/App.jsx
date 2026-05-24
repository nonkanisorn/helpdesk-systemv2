import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import "@mui/material/styles/styled";

import "./App.css";
//------iimport layout------//
//ADMIN

import Headerbaradmin from "./layout/admin/Headerbaradmin";
import Sidebaradmin from "./layout/admin/Sidebaradmin";

//USER
import Headerbaruser from "./layout/users/Headerbaruser";
import Sidebaruser from "./layout/users/Sidebaruser";

//------Route------//
//ADMIN

import LoginPage from "./components/LoginPage";

//USER

//Manager
import Reportcasetechnician from "./components/technician/Reportcasetech";
import ManagerRoute from "./Routes/ManagerRoute";
import { login } from "./store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import UserRoute from "./Routes/UserRoute";
import AdminRoute from "./Routes/AdminRoute";
import { useState } from "react";
import Notfound404 from "./components/Notfound404";
import ResponsiveAppBar from "./layout/ResponsiveAppBar";
import TechnicianRoute from "./Routes/TechnicianRoute";
import Profile from "./components/Profile";
import { useSelector } from "react-redux";
import Headerbarmanager from "./layout/manager/Headerbarmanager";
import Sidebarmanager from "./layout/manager/Sidebarmanager";
import Headerbartech from "./layout/tech/Headerbartech";
import Sidebartech from "./layout/tech/Sidebartech";
import Testapi from "./components/Testapi";
import SetPasswordPage from "./components/SetPasswordPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import { hasAnyPermission, hasPermission } from "./auth/permissions";
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.user.permissions);
  const [loading, setLoading] = useState(true); // เพิ่ม state สำหรับตรวจสอบการโหลด
  const checktimerepair = async () => {
    try {
      const res = await axios
        .get(`${process.env.REACT_APP_API_URL}/checktimeticket`)
        .then((res) => {});
    } catch (error) {}
  };
  const currentUser = async (storedUser) => {
    if (!storedUser?.token || !storedUser?.user_id) return null;

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/current-user/${storedUser.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        },
      );
      const user = res.data.result ?? res.data;
      dispatch(
        login({
          ...storedUser,
          role_id: user.role_id,
          role_name: user.role_name,
          first_name: user.first_name,
          last_name: user.last_name,
          user_id: user.user_id,
          department_id: user.department_id ?? user.dep_id,
          permissions: user.permissions ?? storedUser.permissions ?? [],
        }),
      );
      setLoading(false);
      return res.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    checktimerepair();
  });
  useEffect(() => {
    const Token = localStorage.getItem("user");
    if (Token) {
      const idToken = JSON.parse(Token);
      dispatch(login(idToken));
      currentUser(idToken)
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch]);
  if (loading) {
    return null; // ไม่แสดงอะไรในขณะที่กำลังโหลด
  }
  return (
    <>
      <Routes>
        <Route path="*" element={<Notfound404 />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/set-password/:token" element={<SetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<Notfound404 statusCode={403} />} />
        <Route path="/404" element={<Notfound404 />} />
        <Route path="/testapi" element={<Testapi />} />
        <Route
          path="/profile"
          element={
            hasAnyPermission(permissions, [
              "manage_users",
              "manage_roles",
              "manage_departments",
              "manage_ticket_statuses",
            ]) ? (
              <React.Fragment>
                <div className="app">
                  <Sidebaradmin />
                  <main className="content">
                    <Headerbaradmin />
                    <div className="content_body">
                      <Box m="19px">
                        <Profile />
                      </Box>
                    </div>
                  </main>
                </div>
              </React.Fragment>
            ) : hasAnyPermission(permissions, [
                "assign_ticket",
                "view_all_ticket",
              ]) ? (
              <React.Fragment>
                <div className="app">
                  <Sidebarmanager />
                  <main className="content">
                    <Headerbarmanager />
                    <div className="content_body">
                      <Box m="19px">
                        <Profile />
                      </Box>
                    </div>
                  </main>
                </div>
              </React.Fragment>
            ) : hasPermission(permissions, "view_assigned_ticket") ? (
              <React.Fragment>
                <div className="app">
                  <Sidebartech />
                  <main className="content">
                    <Headerbartech />
                    <div className="content_body">
                      <Box m="19px">
                        <Profile />
                      </Box>
                    </div>
                  </main>
                </div>
              </React.Fragment>
            ) : hasAnyPermission(permissions, [
                "create_ticket",
                "view_own_ticket",
                "confirm_repair",
              ]) ? (
              <React.Fragment>
                <div className="app">
                  {/* <Sidebaruser /> */}
                  <main className="content">
                    <Headerbaruser />
                    <div className="content_body">
                      <Box m="19px">
                        <Profile />
                      </Box>
                    </div>
                  </main>
                </div>
              </React.Fragment>
            ) : (
              <Notfound404 statusCode={403} />
            )
          }
        />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/user/*" element={<UserRoute />} />
        <Route path="/manager/*" element={<ManagerRoute />} />
        <Route path="/technician/*" element={<TechnicianRoute />} />
      </Routes>
    </>
  );
}
export default App;
