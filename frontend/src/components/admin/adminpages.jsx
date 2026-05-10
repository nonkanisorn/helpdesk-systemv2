// // import React from "react";
// import axios from "axios";
// import { useEffect } from "react";
// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   Paper,
//   Box,
//   Typography,
//   Grid,
//   Stack,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Input,
//   TextField,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { blue, yellow, deepOrange } from "@mui/material/colors";
// import PersonIcon from "@mui/icons-material/Person";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import FlagIcon from "@mui/icons-material/Flag";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import AddModeratorIcon from "@mui/icons-material/AddModerator";
// import DashboardadminCard from "./DashboardadminCard";
// import AdminQuickActionCard from "./AdminQuickActionCard";
// import AddRoleDialog from "./dialog/AddDialog/AddRoleDialog";
// import AddStatusDialog from "./dialog/AddDialog/AddStatusDialog";
// import AddDepartmentDialog from "./dialog/AddDialog/AddDepartmentDialog";
// import { useSelector } from "react-redux";
// function Adminpages() {
//   const [role, setRole] = useState([]);
//   const [user, setUser] = useState([]);
//   const [device, setDevice] = useState([]);
//   const [status, setStatus] = useState([]);
//   const [department, setDepartment] = useState([]);
//   const token = useSelector((state) => state.user.token);
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const handleCloseAddUserDialog = () => setOpenAddUserDialog(false);
//   const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
//   const [openAddRoleDialog, setOpenRoleDialog] = useState(false);
//   const [openAddStatusDialog, setOpenStatusDialog] = useState(false);
//   const [openAddDepartmentDialog, setOpenDepartmentDialog] = useState(false);
//   const handleAddRoleDialog = () => {
//     setOpenRoleDialog(true);
//   };
//   const handleCloseAddRoleDialog = () => {
//     setOpenRoleDialog(false);
//   };
//   const handleAddStatusDialog = () => {
//     setOpenStatusDialog(true);
//   };
//   const handleCloseAddStatusDialog = () => {
//     setOpenStatusDialog(false);
//   };
//   const handleAddDepartmentDialog = () => {
//     setOpenDepartmentDialog(true);
//   };
//   const handleCloseDepartmentDialog = () => {
//     setOpenDepartmentDialog(false);
//   };
//   //react-hook-form
//   const defaultValues = {
//     // ช่องข้อความ
//     username: "",
//     password: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     // ช่อง select (number)
//     role_id: null, // 👈 number | null
//     department_id: null, // 👈 number | null
//     is_active: 1,
//   };
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     reset,
//     control,
//   } = useForm({ defaultValues });
//   const onSubmit = async (data) => {
//     console.log("is_active:", data.is_active, typeof data.is_active);
//     await axios
//       .post(
//         `${apiUrl}/register`,
//         {
//           username: data.username,
//           password: data.password,
//           role_id: data.role_id,
//           first_name: data.first_name,
//           last_name: data.last_name,
//           department_id: data.dep_id,
//           email: data.email,
//           phone: data.phone,
//           is_active: data.is_active,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       )
//       .then((res) => {
//         reset(defaultValues);
//       });
//     console.log(watch(data));
//   };
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchRoleData = await axios.get(`${apiUrl}/roles`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRole(fetchRoleData.data);
//
//         const fetchUserData = await axios.get(`${apiUrl}/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(fetchUserData.data.result.length);
//
//         const fetchDeviceData = await axios.get(`${apiUrl}/devices`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDevice(fetchDeviceData.data.length);
//
//         const fetchStatusData = await axios.get(`${apiUrl}/status`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStatus(fetchStatusData.data.length);
//
//         const fetchDepartmentData = await axios.get(`${apiUrl}/departments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDepartment(fetchDepartmentData.data.result);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//   }, []);
//   return (
//     <>
//       <Dialog
//         open={openAddUserDialog}
//         onClose={handleCloseAddUserDialog}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           <Stack direction="row" justifyContent="space-between">
//             <Typography variant="h5">เพิ่มผู้ใช้</Typography>
//             <Button onClick={handleCloseAddUserDialog}>
//               <Typography color="black">x</Typography>
//             </Button>
//           </Stack>
//         </DialogTitle>
//         <DialogContent sx={{ overflowY: "auto" }}>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Stack spacing={1}>
//               <Typography>ชื่อผู้ใช้</Typography>
//               <TextField {...register("username")}></TextField>
//               <Typography>รหัสผ่าน</Typography>
//               <TextField {...register("password")}></TextField>
//               <Typography>ชื่อจริง</Typography>
//               <TextField {...register("first_name")}></TextField>
//               <Typography>นามสกุล</Typography>
//               <TextField {...register("last_name")}></TextField>
//               <Typography>อีเมล์</Typography>
//               <TextField {...register("email")}></TextField>
//               <Typography>เบอร์โทรศัพท์</Typography>
//               <TextField {...register("phone")}></TextField>
//               <Typography>บทบาท</Typography>
//               <Controller
//                 control={control}
//                 name="role_id"
//                 render={({ field }) => (
//                   <Select defaultValue={null} {...field}>
//                     {role.map((items, index) => (
//                       <MenuItem value={items.role_id}>
//                         {items.role_name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 )}
//               ></Controller>
//               <Typography>แผนก</Typography>
//               <Controller
//                 control={control}
//                 name="dep_id"
//                 render={({ field }) => (
//                   <Select defaultValue={" "} {...field}>
//                     {department.map((items, index) => (
//                       <MenuItem value={items.dep_id}>{items.dep_name}</MenuItem>
//                     ))}
//                   </Select>
//                 )}
//               ></Controller>
//               <Typography>สถานะผู้ใช้งาน</Typography>
//               <Controller
//                 control={control}
//                 name="is_active"
//                 defaultValue={1}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     value={field.value ?? 1}
//                     onChange={(e) => field.onChange(Number(e.target.value))} // ✅ cast เป็น number
//                   >
//                     <MenuItem value={0}>ไม่พร้อมใช้งาน</MenuItem>
//                     <MenuItem value={1}>พร้อมใช้งาน</MenuItem>
//                   </Select>
//                 )}
//               />
//
//               <Button variant="contained" type="submit">
//                 เพิ่ม
//               </Button>
//             </Stack>
//           </form>
//         </DialogContent>
//       </Dialog>
//
//       <Typography variant="h4" fontWeight="fontWeightBold">
//         Admin Dashboard
//       </Typography>
//       <Typography color="grey" sx={{ mb: 3 }}>
//         ภาพรวมระบบและการจัดการทั้งหมด
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={1} md={3}>
//           <DashboardadminCard
//             title="สมาชิก"
//             data={user}
//             icon={<PersonIcon />}
//           />
//         </Grid>
//         <Grid item xs={1} md={3}>
//           {" "}
//           <DashboardadminCard
//             title="บทบาท"
//             data={role.length}
//             icon={<AdminPanelSettingsIcon />}
//           />
//         </Grid>
//         <Grid item xs={1} md={3}>
//           {" "}
//           <DashboardadminCard title="สถานะ" data={status} icon={<FlagIcon />} />
//         </Grid>
//         <Grid item xs={1} md={3}>
//           {" "}
//           <DashboardadminCard
//             title="แผนก"
//             data={department.length}
//             icon={<ApartmentIcon />}
//           />
//         </Grid>
//         {/* <Grid item xs={1} md={2}> */}
//         {/*   {" "} */}
//         {/*   <DashboardadminCard title="ประเภทอุปกรณ์" data={device} /> */}
//         {/* </Grid> */}
//         {/* <Grid item xs={1} md={2}> */}
//         {/*   {" "} */}
//         {/*   <DashboardadminCard title="ประเภทปัญหา" /> */}
//         {/* </Grid> */}
//       </Grid>
//       <Typography variant="h4" sx={{ mt: 4, mb: 3 }}>
//         การจัดการด่วน
//       </Typography>
//       <Grid container spacing={4}>
//         <Grid item xs={1} md={3}>
//           <AdminQuickActionCard
//             icon=<PersonAddIcon sx={{ color: "green", fontSize: 50 }} />
//             title="ผู้ใช้งาน"
//             subtitle="เพิ่มผู้ใช้งาน"
//             func={() => setOpenAddUserDialog(true)}
//           />
//         </Grid>
//         <Grid item xs={1} md={3}>
//           <AdminQuickActionCard
//             icon={<AddModeratorIcon sx={{ color: blue[400], fontSize: 50 }} />}
//             title="บทบาท"
//             subtitle="เพิ่มบทบาท"
//             func={() => handleAddRoleDialog()}
//           />
//           <AddRoleDialog
//             open={openAddRoleDialog}
//             onClose={handleCloseAddRoleDialog}
//             token={token}
//           />
//         </Grid>
//         <Grid item xs={1} md={3}>
//           <AdminQuickActionCard
//             icon={<FlagIcon sx={{ color: yellow[400], fontSize: 50 }} />}
//             title="สถานะ"
//             subtitle="เพิ่มสถานะ"
//             func={() => handleAddStatusDialog()}
//           />
//           <AddStatusDialog
//             open={openAddStatusDialog}
//             onClose={handleCloseAddStatusDialog}
//             token={token}
//           />
//         </Grid>
//         <Grid item xs={1} md={3}>
//           <AdminQuickActionCard
//             icon={
//               <ApartmentIcon sx={{ color: deepOrange[400], fontSize: 50 }} />
//             }
//             title="แผนก"
//             subtitle="เพิ่มแผนก"
//             func={() => handleAddDepartmentDialog()}
//           />
//           <AddDepartmentDialog
//             open={openAddDepartmentDialog}
//             onClose={handleCloseDepartmentDialog}
//             token={token}
//           />
//         </Grid>
//       </Grid>
//     </>
//   );
// }
//
// export default Adminpages;
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
} from "@mui/material";
import { blue, yellow, deepOrange } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FlagIcon from "@mui/icons-material/Flag";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddModeratorIcon from "@mui/icons-material/AddModerator";

import DashboardadminCard from "./DashboardadminCard";
import AdminQuickActionCard from "./AdminQuickActionCard";
import AddRoleDialog from "./dialog/AddDialog/AddRoleDialog";
import AddStatusDialog from "./dialog/AddDialog/AddStatusDialog";
import AddDepartmentDialog from "./dialog/AddDialog/AddDepartmentDialog";
import { useSelector } from "react-redux";

function Adminpages() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [role, setRole] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [statusCount, setStatusCount] = useState(0);
  const [department, setDepartment] = useState([]);

  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openAddRoleDialog, setOpenRoleDialog] = useState(false);
  const [openAddStatusDialog, setOpenStatusDialog] = useState(false);
  const [openAddDepartmentDialog, setOpenDepartmentDialog] = useState(false);

  const [loadingUser, setLoadingUser] = useState(false);

  const defaultValues = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
    dep_id: "",
    is_active: 1,
  };

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues,
  });

  const fetchDashboardData = async () => {
    try {
      const [roleRes, userRes, statusRes, departmentRes] = await Promise.all([
        axios.get(`${apiUrl}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const roleData = roleRes.data.data ?? roleRes.data ?? [];
      const userData = userRes.data.result ?? userRes.data ?? [];
      const statusData = statusRes.data.result ?? statusRes.data ?? [];
      const departmentData =
        departmentRes.data.result ?? departmentRes.data ?? [];

      setRole(roleData);
      setUserCount(userData.length);
      setStatusCount(statusData.length);
      setDepartment(departmentData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setLoadingUser(true);

      await axios.post(
        `${apiUrl}/register`,
        {
          username: data.username,
          password: data.password,
          role_id: data.role_id,
          first_name: data.first_name,
          last_name: data.last_name,
          department_id: data.dep_id,
          email: data.email,
          phone: data.phone,
          is_active: data.is_active,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      reset(defaultValues);
      setOpenAddUserDialog(false);
      fetchDashboardData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <>
      <Dialog
        open={openAddUserDialog}
        onClose={loadingUser ? undefined : () => setOpenAddUserDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                เพิ่มผู้ใช้
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่มบัญชีผู้ใช้งานใหม่เข้าสู่ระบบ
              </Typography>
            </Box>

            <Button
              onClick={() => setOpenAddUserDialog(false)}
              color="inherit"
              disabled={loadingUser}
            >
              ✕
            </Button>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="add-user-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={2}>
              <TextField
                label="ชื่อผู้ใช้"
                fullWidth
                required
                disabled={loadingUser}
                {...register("username")}
              />

              <TextField
                label="รหัสผ่าน"
                type="password"
                fullWidth
                required
                disabled={loadingUser}
                {...register("password")}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="ชื่อจริง"
                  fullWidth
                  required
                  disabled={loadingUser}
                  {...register("first_name")}
                />

                <TextField
                  label="นามสกุล"
                  fullWidth
                  required
                  disabled={loadingUser}
                  {...register("last_name")}
                />
              </Stack>

              <TextField
                label="อีเมล"
                type="email"
                fullWidth
                disabled={loadingUser}
                {...register("email")}
              />

              <TextField
                label="เบอร์โทรศัพท์"
                fullWidth
                disabled={loadingUser}
                {...register("phone")}
              />

              <Controller
                control={control}
                name="role_id"
                render={({ field }) => (
                  <TextField
                    select
                    label="บทบาท"
                    fullWidth
                    required
                    disabled={loadingUser}
                    {...field}
                  >
                    {role.map((item) => (
                      <MenuItem key={item.role_id} value={item.role_id}>
                        {item.role_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="dep_id"
                render={({ field }) => (
                  <TextField
                    select
                    label="แผนก"
                    fullWidth
                    required
                    disabled={loadingUser}
                    {...field}
                  >
                    {department.map((item) => (
                      <MenuItem key={item.dep_id} value={item.dep_id}>
                        {item.dep_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <TextField
                    select
                    label="สถานะผู้ใช้งาน"
                    fullWidth
                    disabled={loadingUser}
                    value={field.value ?? 1}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <MenuItem value={1}>พร้อมใช้งาน</MenuItem>
                    <MenuItem value={0}>ไม่พร้อมใช้งาน</MenuItem>
                  </TextField>
                )}
              />
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            flexDirection: { xs: "column-reverse", sm: "row" },
            gap: 1,
          }}
        >
          <Button
            onClick={() => setOpenAddUserDialog(false)}
            color="inherit"
            disabled={loadingUser}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            ยกเลิก
          </Button>

          <Button
            form="add-user-form"
            type="submit"
            variant="contained"
            disabled={loadingUser}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {loadingUser ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} color="inherit" />
                <span>กำลังเพิ่ม...</span>
              </Stack>
            ) : (
              "เพิ่มผู้ใช้"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <AddRoleDialog
        open={openAddRoleDialog}
        onClose={() => setOpenRoleDialog(false)}
        onSuccess={fetchDashboardData}
        token={token}
      />

      <AddStatusDialog
        open={openAddStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        onSuccess={fetchDashboardData}
        token={token}
      />

      <AddDepartmentDialog
        open={openAddDepartmentDialog}
        onClose={() => setOpenDepartmentDialog(false)}
        onSuccess={fetchDashboardData}
        token={token}
      />

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
            }}
          >
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                Admin Dashboard
              </Typography>

              <Typography variant="body2" color="text.secondary">
                ภาพรวมระบบและการจัดการทั้งหมด
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardadminCard
                  title="สมาชิก"
                  data={userCount}
                  icon={<PersonIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DashboardadminCard
                  title="บทบาท"
                  data={role.length}
                  icon={<AdminPanelSettingsIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DashboardadminCard
                  title="สถานะ"
                  data={statusCount}
                  icon={<FlagIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DashboardadminCard
                  title="แผนก"
                  data={department.length}
                  icon={<ApartmentIcon />}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
            }}
          >
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                การจัดการด่วน
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่มข้อมูลพื้นฐานของระบบได้จากเมนูลัด
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <AdminQuickActionCard
                  icon={<PersonAddIcon sx={{ color: "green", fontSize: 50 }} />}
                  title="ผู้ใช้งาน"
                  subtitle="เพิ่มผู้ใช้งาน"
                  func={() => setOpenAddUserDialog(true)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AdminQuickActionCard
                  icon={
                    <AddModeratorIcon sx={{ color: blue[400], fontSize: 50 }} />
                  }
                  title="บทบาท"
                  subtitle="เพิ่มบทบาท"
                  func={() => setOpenRoleDialog(true)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AdminQuickActionCard
                  icon={<FlagIcon sx={{ color: yellow[700], fontSize: 50 }} />}
                  title="สถานะ"
                  subtitle="เพิ่มสถานะ"
                  func={() => setOpenStatusDialog(true)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AdminQuickActionCard
                  icon={
                    <ApartmentIcon
                      sx={{ color: deepOrange[400], fontSize: 50 }}
                    />
                  }
                  title="แผนก"
                  subtitle="เพิ่มแผนก"
                  func={() => setOpenDepartmentDialog(true)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Box>
    </>
  );
}

export default Adminpages;
