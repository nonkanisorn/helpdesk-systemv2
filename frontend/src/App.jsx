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
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role_id = useSelector((state) => state.user.role_id);
  const [loading, setLoading] = useState(true); // เพิ่ม state สำหรับตรวจสอบการโหลด
  const checktimerepair = async () => {
    try {
      const res = await axios
        .get(`${process.env.REACT_APP_API_URL}/checktimeticket`)
        .then((res) => { });
    } catch (error) { }
  };
  const currentUser = async (idToken) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/current-user`,
        {},
        {
          headers: {
            authtoken: idToken,
          },
        },
      );
      dispatch(
        login({
          username: res.data[0].username,
          role: res.data[0].role_id,
          token: idToken,
          full_name: res.data[0].full_name,
          user_id: res.data[0].user_id,
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
      currentUser(idToken.token)
        .catch(() => { })
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
        <Route path="*" element={<Notfound404 text="ไม่มีpath" />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/testapi" element={<Testapi />} />
        <Route
          path="/profile"
          element={
            role_id === 1 ? (
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
            ) : role_id === 2 ? (
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
            ) : role_id === 3 ? (
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
            ) : role_id === 4 ? (
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
            ) : null
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
