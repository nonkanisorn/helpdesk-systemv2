import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebaradmin from "../layout/admin/Sidebaradmin";
import Headerbaradmin from "../layout/admin/Headerbaradmin";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import Notfound404 from "../components/Notfound404";

import Manageuser from "../components/admin/ManageuserPages/Manageuser";
import Managerole from "../components/admin/ManagerolePages/Managerole";
import Managedevice from "../components/admin/ManagedevicePages/Managedevice";
import Managestatus from "../components/admin/ManagestatusPages/Managestatus";
import Adddevice from "../components/admin/ManagedevicePages/Adddevice";
import Editdevice from "../components/admin/ManagedevicePages/Editdevice";
import Editrole from "../components/admin/ManagerolePages/Editrole";
import Addrole from "../components/admin/ManagerolePages/Addrole";
import Managedepartment from "../components/admin/ManagedepartmentPages/Managedepartment";
import Adddepartment from "../components/admin/ManagedepartmentPages/Adddeparment";
import Editdepartment from "../components/admin/ManagedepartmentPages/Editdepartment";
import Adminpages from "../components/admin/adminpages";
import Addstatus from "../components/admin/ManagestatusPages/Addstatus";
import Editstatus from "../components/admin/ManagestatusPages/Editstatus";
import Adduser from "../components/admin/ManageuserPages/Adduser";
import Edituser from "../components/admin/ManageuserPages/Edituser";
import ManageissuesPages from "../components/admin/Manageissues/ManageissuesPages";
import ManageTypeDevices from "../components/admin/ManagedevicePages/ManageTypeDevices";
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true); // เพิ่ม state สำหรับตรวจสอบการโหลด
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentAdmin = async (token) => {
    try {
      const res = await axios.get(
        // `${process.env.REACT_APP_API_URL}/current-admin`,
        `${process.env.REACT_APP_API_URL}/admin/ping`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(login(storedUser));
    }
    console.log("store", storedUser);
  }, [dispatch]);
  useEffect(() => {
    const verifyAdmin = async () => {
      if (user?.token) {
        try {
          await currentAdmin(user.token);
          setOk(true);
        } catch (err) {
          console.error(err);
          setOk(false);
          // navigate('/login');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate("/login");
      }
    };

    verifyAdmin();
  }, [user, navigate]);

  if (loading) {
    return null; // ไม่แสดงอะไรในขณะที่กำลังโหลด
  }
  const text = "No permission";
  return ok ? (
    <Box
      className="app"
      sx={{
        display: "flex",
        minHeight: "100dvh",
        overflow: "hidden",
      }}
    >
      <Sidebaradmin />

      <Box
        component="main"
        className="content"
        sx={{
          backgroundColor: "#f5f6fa",
          flexGrow: 1,
          minWidth: 0,
          height: "100dvh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Headerbaradmin />

        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
          }}
        >
          <Routes>
            <Route path="manageuser" element={<Manageuser />} />
            <Route path="managerole" element={<Managerole />} />
            <Route path="managedevice" element={<Managedevice />} />
            <Route path="index" element={<Adminpages />} />
            <Route path="managestatus" element={<Managestatus />} />
            <Route path="managedepartment" element={<Managedepartment />} />

            <Route path="adddevice" element={<Adddevice />} />
            <Route path="edituser/:users_id" element={<Edituser />} />
            <Route
              path="editdevice/:dev_id/:dev_name"
              element={<Editdevice />}
            />

            <Route path="addrole" element={<Addrole />} />
            <Route path="editrole/:role_id/:role_name" element={<Editrole />} />

            <Route path="addstatus" element={<Addstatus />} />
            <Route
              path="editstatus/:status_id/:status_name"
              element={<Editstatus />}
            />

            <Route path="adddepartment" element={<Adddepartment />} />
            <Route
              path="editdepartment/:dep_id/:dep_name"
              element={<Editdepartment />}
            />

            <Route path="managetypedevice" element={<ManageTypeDevices />} />
            <Route
              path="manage/issues-categories"
              element={<ManageissuesPages />}
            />

            <Route path="adduser" element={<Adduser />} />
            <Route path="*" element={<Notfound404 text="ไม่มีpathนี้" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  ) : (
    <Notfound404 text={text} />
  );
  // return ok ? (
  //   <div className="app">
  //     <Sidebaradmin />
  //     <main className="content" style={{ backgroundColor: "#f5f6fa" }}>
  //       <Headerbaradmin />
  //       <Box>
  //         <Box m="19px">
  //           <Routes>
  //             <Route path="manageuser" element={<Manageuser />} />
  //             <Route path="managerole" element={<Managerole />} />
  //             <Route path="managedevice" element={<Managedevice />} />
  //             <Route path="index" element={<Adminpages />} />
  //             <Route path="managestatus" element={<Managestatus />} />
  //             <Route path="managedepartment" element={<Managedepartment />} />
  //             {/* <Route path="" element={<Managedepartment />} /> */}
  //             <Route path="adddevice" element={<Adddevice />} />
  //             <Route path="edituser/:users_id" element={<Edituser />} />
  //             <Route
  //               path="editdevice/:dev_id/:dev_name"
  //               element={<Editdevice />}
  //             />
  //             <Route path="addrole" element={<Addrole />} />
  //             <Route
  //               path="editrole/:role_id/:role_name"
  //               element={<Editrole />}
  //             />
  //             <Route path="addstatus" element={<Addstatus />} />
  //             <Route
  //               path="editstatus/:status_id/:status_name"
  //               element={<Editstatus />}
  //             />
  //             <Route path="adddepartment" element={<Adddepartment />} />
  //             <Route
  //               path="editdepartment/:dep_id/:dep_name"
  //               element={<Editdepartment />}
  //             />
  //             <Route path="managetypedevice" element={<Addtypedevice />} />
  //             <Route
  //               path="manage/issues-categories"
  //               element={<ManageissuesPages />}
  //             />
  //             <Route path="adduser" element={<Adduser />} />
  //             <Route path="*" element={<Notfound404 text="ไม่มีpathนี้" />} />
  //           </Routes>
  //         </Box>
  //       </Box>
  //     </main>
  //   </div>
  // ) : (
  //   <Notfound404 text={text} />
  // );
};

export default AdminRoute;
