// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import { Switch, Box } from "@mui/material";
// import Paper from "@mui/material/Paper";
// import { useForm, Controller } from "react-hook-form";
// import { useSelector } from "react-redux";
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Typography,
//   Input,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
//
// import { Link } from "react-router-dom";
// import { Stack } from "@mui/system";
// import EditUserDialog from "../dialog/EditDialog/EditUserDialog";
//
// function Manageuser() {
//   const defaultValues = {
//     // ช่องข้อความ
//     username: "",
//     password: "",
//     confirmPassword: "",
//     full_name: "",
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
//   } = useForm({ defaultValues, mode: "onChange" });
//   const password = watch("password");
//   const [userData, setUserData] = useState([]);
//
//   const token = useSelector((state) => state.user.token);
//   const [roleData, setRoleData] = useState([]);
//   const [depData, setDepData] = useState([]);
//   const [refresh, setrefresh] = useState(false);
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
//   const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
//   const [selectedUserID, setSelectedUserID] = useState(null);
//   const handleOpenAddUserDialog = () => setOpenAddUserDialog(true);
//   const handleCloseAddUserDialog = () => setOpenAddUserDialog(false);
//   const handleCloseEditUserDialog = () => setOpenEditUserDialog(false);
//   const fullName = userData.first_name + userData.last_name;
//
//   console.log(watch("is_active"));
//   const handleStatusActiveUsers = async (users_id, checked) => {
//     const newStatus = checked ? 1 : 0; // ✅ boolean -> 0/1
//
//     // ✅ อัปเดต UI ทันที
//     setUserData((prev) =>
//       prev.map((u) =>
//         u.users_id === users_id ? { ...u, is_active: newStatus } : u,
//       ),
//     );
//
//     try {
//       await axios.patch(
//         `${apiUrl}/users/isactive/${users_id}`,
//         {
//           is_active: newStatus, // ✅ ส่ง 0/1
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//     } catch (error) {
//       console.log(error);
//
//       // rollback ถ้า error
//       setUserData((prev) =>
//         prev.map((u) =>
//           u.users_id === users_id
//             ? { ...u, is_active: newStatus === 1 ? 0 : 1 }
//             : u,
//         ),
//       );
//     }
//   };
//
//   const handleDelete = (user_id) => {
//     axios
//       .delete(`${apiUrl}/users/${user_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(() => {
//         console.log("ลบสําเร็จ");
//         setrefresh((prev) => !prev);
//       });
//   };
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/users/view`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserData(response.data.result);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [refresh]);
//   useEffect(() => {
//     const fetchRoleData = async () => {
//       try {
//         await axios
//           .get(`${apiUrl}/roles`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .then((res) => {
//             console.log("res", res);
//             setRoleData(res.data);
//           });
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     const fetchDepData = async () => {
//       try {
//         await axios
//           .get(`${apiUrl}/departments`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .then((res) => {
//             setDepData(res.data.result);
//           });
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchDepData();
//     fetchRoleData();
//   }, []);
//   if (!userData || userData.length === 0) {
//     return null; // หรือแสดงข้อความแจ้งเตือนอื่นๆ
//   }
//   console.log("dasdsa1`", userData);
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
//           department_id: data.department_id,
//           email: data.email,
//           phone: data.phone,
//           is_active: data.is_active,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       )
//       .then((res) => {
//         reset(defaultValues);
//       });
//     console.log(watch(data));
//   };
//
//   console.log("rdata", roleData);
//   return (
//     // TODO: แก้ไขข้อมูลผู้ใช้ pass
//     <>
//       <EditUserDialog
//         open={openEditUserDialog}
//         onClose={handleCloseEditUserDialog}
//         onSuccess={fetchData}
//         id={selectedUserID}
//         roleData={roleData}
//         depData={depData}
//       />
//       <Dialog
//         open={openAddUserDialog}
//         onClose={handleCloseAddUserDialog}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h5" fontWeight={600}>
//               เพิ่มผู้ใช้
//             </Typography>
//
//             <Button onClick={handleCloseAddUserDialog} color="inherit">
//               ✕
//             </Button>
//           </Stack>
//         </DialogTitle>
//
//         <DialogContent dividers>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Stack spacing={3}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: {
//                     xs: "1fr",
//                     sm: "1fr 1fr",
//                   },
//                   gap: 2,
//                 }}
//               >
//                 <TextField
//                   label="ชื่อผู้ใช้"
//                   fullWidth
//                   {...register("username")}
//                 />
//
//                 <TextField label="อีเมล์" fullWidth {...register("email")} />
//
//                 <TextField
//                   label="รหัสผ่าน"
//                   type="password"
//                   fullWidth
//                   {...register("password")}
//                 />
//
//                 <TextField
//                   label="ยืนยันรหัสผ่าน"
//                   type="password"
//                   fullWidth
//                   error={!!errors.confirmPassword}
//                   helperText={errors.confirmPassword?.message}
//                   {...register("confirmPassword", {
//                     validate: (value) =>
//                       value === password || "รหัสผ่านไม่ตรงกัน",
//                   })}
//                 />
//
//                 <TextField label="ชื่อ" fullWidth {...register("first_name")} />
//
//                 <TextField
//                   label="นามสกุล"
//                   fullWidth
//                   {...register("last_name")}
//                 />
//
//                 <TextField
//                   label="เบอร์โทรศัพท์"
//                   fullWidth
//                   {...register("phone")}
//                 />
//
//                 <Controller
//                   control={control}
//                   name="role_id"
//                   render={({ field }) => (
//                     <FormControl fullWidth>
//                       <InputLabel>บทบาท</InputLabel>
//                       <Select
//                         {...field}
//                         label="บทบาท"
//                         value={field.value ?? ""}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                       >
//                         {roleData.map((item) => (
//                           <MenuItem key={item.role_id} value={item.role_id}>
//                             {item.role_name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   )}
//                 />
//
//                 <Controller
//                   control={control}
//                   name="department_id"
//                   render={({ field }) => (
//                     <FormControl fullWidth>
//                       <InputLabel>แผนก</InputLabel>
//                       <Select
//                         {...field}
//                         label="แผนก"
//                         value={field.value ?? ""}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                       >
//                         {depData.map((item) => (
//                           <MenuItem key={item.dep_id} value={item.dep_id}>
//                             {item.dep_name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   )}
//                 />
//
//                 <Controller
//                   control={control}
//                   name="is_active"
//                   render={({ field }) => (
//                     <FormControl fullWidth>
//                       <InputLabel>สถานะผู้ใช้งาน</InputLabel>
//                       <Select
//                         {...field}
//                         label="สถานะผู้ใช้งาน"
//                         value={field.value ?? 1}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                       >
//                         <MenuItem value={1}>พร้อมใช้งาน</MenuItem>
//                         <MenuItem value={0}>ไม่พร้อมใช้งาน</MenuItem>
//                       </Select>
//                     </FormControl>
//                   )}
//                 />
//               </Box>
//
//               <Stack direction="row" justifyContent="flex-end" spacing={1}>
//                 <Button
//                   variant="outlined"
//                   color="inherit"
//                   onClick={handleCloseAddUserDialog}
//                 >
//                   ยกเลิก
//                 </Button>
//
//                 <Button variant="contained" type="submit">
//                   เพิ่มผู้ใช้
//                 </Button>
//               </Stack>
//             </Stack>
//           </form>
//         </DialogContent>
//       </Dialog>
//       {/* <Dialog */}
//       {/*   open={openAddUserDialog} */}
//       {/*   onClose={handleCloseAddUserDialog} */}
//       {/*   fullWidth */}
//       {/*   maxWidth="sm" */}
//       {/* > */}
//       {/*   <DialogTitle> */}
//       {/*     <Stack direction="row" justifyContent="space-between"> */}
//       {/*       <Typography variant="h5">เพิ่มผู้ใช้</Typography> */}
//       {/*       <Button onClick={handleCloseAddUserDialog}> */}
//       {/*         <Typography color="black">x</Typography> */}
//       {/*       </Button> */}
//       {/*     </Stack> */}
//       {/*   </DialogTitle> */}
//       {/*   <DialogContent sx={{ overflowY: "auto" }}> */}
//       {/*     <form onSubmit={handleSubmit(onSubmit)}> */}
//       {/*       <Stack spacing={1}> */}
//       {/*         <Typography>ชื่อผู้ใช้</Typography> */}
//       {/*         <TextField {...register("username")}></TextField> */}
//       {/*         <Typography>รหัสผ่าน</Typography> */}
//       {/*         <TextField type="password" {...register("password")}></TextField> */}
//       {/*         <Typography>ยืนยันรหัสผ่าน</Typography> */}
//       {/*         <TextField */}
//       {/*           type="password" */}
//       {/*           {...register("confirmPassword", { */}
//       {/*             validate: (value) => */}
//       {/*               value === password || "รหัสผ่านไม่ตรงกัน", */}
//       {/*           })} */}
//       {/*         ></TextField> */}
//       {/*         {errors.confirmPassword && ( */}
//       {/*           <Typography>{errors.confirmPassword.message}</Typography> */}
//       {/*         )} */}
//       {/*         <Typography>ชื่อ</Typography> */}
//       {/*         <TextField {...register("first_name")}></TextField> */}
//       {/*         <Typography>นามสกุล</Typography> */}
//       {/*         <TextField {...register("last_name")}></TextField> */}
//       {/*         <Typography>อีเมล์</Typography> */}
//       {/*         <TextField {...register("email")}></TextField> */}
//       {/*         <Typography>เบอร์โทรศัพท์</Typography> */}
//       {/*         <TextField {...register("phone")}></TextField> */}
//       {/*         <Typography>บทบาท</Typography> */}
//       {/*         <Controller */}
//       {/*           control={control} */}
//       {/*           name="role_id" */}
//       {/*           render={({ field }) => ( */}
//       {/*             <Select defaultValue={null} {...field}> */}
//       {/*               {roleData.map((items, index) => ( */}
//       {/*                 <MenuItem value={items.role_id}> */}
//       {/*                   {items.role_name} */}
//       {/*                 </MenuItem> */}
//       {/*               ))} */}
//       {/*             </Select> */}
//       {/*           )} */}
//       {/*         ></Controller> */}
//       {/*         <Typography>แผนก</Typography> */}
//       {/*         <Controller */}
//       {/*           control={control} */}
//       {/*           name="department_id" */}
//       {/*           render={({ field }) => ( */}
//       {/*             <Select defaultValue={" "} {...field}> */}
//       {/*               {depData.map((items, index) => ( */}
//       {/*                 <MenuItem value={items.dep_id}>{items.dep_name}</MenuItem> */}
//       {/*               ))} */}
//       {/*             </Select> */}
//       {/*           )} */}
//       {/*         ></Controller> */}
//       {/*         <Typography>สถานะผู้ใช้งาน</Typography> */}
//       {/*         <Controller */}
//       {/*           control={control} */}
//       {/*           name="is_active" */}
//       {/*           defaultValue={1} */}
//       {/*           render={({ field }) => ( */}
//       {/*             <Select */}
//       {/*               {...field} */}
//       {/*               value={field.value ?? 1} */}
//       {/*               onChange={(e) => field.onChange(Number(e.target.value))} // ✅ cast เป็น number */}
//       {/*             > */}
//       {/*               <MenuItem value={0}>ไม่พร้อมใช้งาน</MenuItem> */}
//       {/*               <MenuItem value={1}>พร้อมใช้งาน</MenuItem> */}
//       {/*             </Select> */}
//       {/*           )} */}
//       {/*         /> */}
//       {/**/}
//       {/*         <Button variant="contained" type="submit"> */}
//       {/*           เพิ่ม */}
//       {/*         </Button> */}
//       {/*       </Stack> */}
//       {/*     </form> */}
//       {/*   </DialogContent> */}
//       {/* </Dialog> */}
//       <Box sx={{ overflowX: "scroll" }}>
//         <h1>
//           จัดการผู้ใช้ {"\u00A0"}
//           {/* <Link to="/admin/adduser"> */}
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => setOpenAddUserDialog(true)}
//           >
//             +ADD
//           </Button>
//           {/* </Link> */}
//         </h1>
//         <TableContainer
//           component={Paper}
//           sx={{ maxHeight: 750, overflowY: "auto" }}
//         >
//           <Table sx={{ minWidth: 650 }} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>ชื่อ</TableCell>
//                 <TableCell>บทบาท</TableCell>
//                 <TableCell>สถานะ</TableCell>
//                 <TableCell>แก้ไข / ลบ</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {userData.map((item, index) => (
//                 <TableRow
//                   key={index}
//                   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                 >
//                   <TableCell>{item.user_id} </TableCell>
//
//                   <TableCell>
//                     {item.first_name + " " + item.last_name}
//                   </TableCell>
//                   <TableCell>{item.role_name}</TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={item.is_active === 1}
//                       onChange={(e) =>
//                         handleStatusActiveUsers(item.user_id, e.target.checked)
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       sx={{ fontSize: "12px", backgroundColor: "#FF9933" }}
//                       onClick={() => {
//                         setSelectedUserID(item.user_id);
//                         setOpenEditUserDialog(true);
//                       }}
//                     >
//                       แก้ไข
//                     </Button>
//
//                     <Button
//                       onClick={() => {
//                         handleDelete(item.user_id);
//                       }}
//                       variant="contained"
//                       sx={{
//                         fontSize: "12px",
//                         backgroundColor: "red",
//                         marginLeft: 3,
//                       }}
//                     >
//                       ลบ
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </>
//   );
// }
// export default Manageuser;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  TablePagination,
  Divider,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import EditUserDialog from "../dialog/EditDialog/EditUserDialog";

function Manageuser() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const defaultValues = {
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
    department_id: "",
    is_active: 1,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm({ defaultValues, mode: "onChange" });

  const password = watch("password");

  const [userData, setUserData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [depData, setDepData] = useState([]);

  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);

  const [loadingAddUser, setLoadingAddUser] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/view`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data.result ?? response.data ?? []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOptions = async () => {
    try {
      const [roleRes, depRes] = await Promise.all([
        axios.get(`${apiUrl}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRoleData(roleRes.data.data ?? roleRes.data ?? []);
      setDepData(depRes.data.result ?? depRes.data ?? []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchOptions();
    }
  }, [token]);

  const handleCloseAddUserDialog = () => {
    if (loadingAddUser) return;
    setOpenAddUserDialog(false);
    reset(defaultValues);
  };

  const handleCloseEditUserDialog = () => {
    setOpenEditUserDialog(false);
    setSelectedUserID(null);
  };

  const handleStatusActiveUsers = async (userId, checked) => {
    const newStatus = checked ? 1 : 0;

    setUserData((prev) =>
      prev.map((user) =>
        user.user_id === userId ? { ...user, is_active: newStatus } : user,
      ),
    );

    try {
      await axios.patch(
        `${apiUrl}/users/isactive/${userId}`,
        { is_active: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Error updating user status:", error);

      setUserData((prev) =>
        prev.map((user) =>
          user.user_id === userId
            ? { ...user, is_active: newStatus === 1 ? 0 : 1 }
            : user,
        ),
      );
    }
  };

  const handleDelete = async (userId) => {
    const shouldDelete = window.confirm("ต้องการลบผู้ใช้นี้ใช่ไหม?");
    if (!shouldDelete) return;

    try {
      await axios.delete(`${apiUrl}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoadingAddUser(true);

      await axios.post(
        `${apiUrl}/register`,
        {
          username: data.username,
          password: data.password,
          role_id: data.role_id,
          first_name: data.first_name,
          last_name: data.last_name,
          department_id: data.department_id,
          email: data.email,
          phone: data.phone,
          is_active: data.is_active,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      reset(defaultValues);
      setOpenAddUserDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoadingAddUser(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = userData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <EditUserDialog
        open={openEditUserDialog}
        onClose={handleCloseEditUserDialog}
        onSuccess={fetchUsers}
        id={selectedUserID}
        roleData={roleData}
        depData={depData}
        token={token}
      />

      <Dialog
        open={openAddUserDialog}
        onClose={handleCloseAddUserDialog}
        fullWidth
        maxWidth="md"
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
              onClick={handleCloseAddUserDialog}
              color="inherit"
              disabled={loadingAddUser}
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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="ชื่อผู้ใช้"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  {...register("username", { required: true })}
                />

                <TextField
                  label="อีเมล"
                  type="email"
                  fullWidth
                  disabled={loadingAddUser}
                  {...register("email")}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="รหัสผ่าน"
                  type="password"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  {...register("password", { required: true })}
                />

                <TextField
                  label="ยืนยันรหัสผ่าน"
                  type="password"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message || " "}
                  {...register("confirmPassword", {
                    required: "กรุณายืนยันรหัสผ่าน",
                    validate: (value) =>
                      value === password || "รหัสผ่านไม่ตรงกัน",
                  })}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="ชื่อ"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  {...register("first_name", { required: true })}
                />

                <TextField
                  label="นามสกุล"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  {...register("last_name", { required: true })}
                />
              </Stack>

              <TextField
                label="เบอร์โทรศัพท์"
                fullWidth
                disabled={loadingAddUser}
                {...register("phone")}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Controller
                  control={control}
                  name="role_id"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="บทบาท"
                      fullWidth
                      required
                      disabled={loadingAddUser}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {roleData.map((item) => (
                        <MenuItem key={item.role_id} value={item.role_id}>
                          {item.role_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="department_id"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="แผนก"
                      fullWidth
                      required
                      disabled={loadingAddUser}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {depData.map((item) => (
                        <MenuItem key={item.dep_id} value={item.dep_id}>
                          {item.dep_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>

              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <TextField
                    select
                    label="สถานะผู้ใช้งาน"
                    fullWidth
                    disabled={loadingAddUser}
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
            onClick={handleCloseAddUserDialog}
            color="inherit"
            disabled={loadingAddUser}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            ยกเลิก
          </Button>

          <Button
            form="add-user-form"
            type="submit"
            variant="contained"
            disabled={loadingAddUser}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {loadingAddUser ? (
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

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                จัดการผู้ใช้
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่ม แก้ไข ลบ และจัดการสถานะผู้ใช้งานในระบบ
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setOpenAddUserDialog(true)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              + เพิ่มผู้ใช้
            </Button>
          </Stack>

          <TableContainer
            sx={{
              display: { xs: "none", md: "block" },
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 850 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ชื่อผู้ใช้</TableCell>
                  <TableCell>บทบาท</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedUsers.map((item) => (
                  <TableRow key={item.user_id} hover>
                    <TableCell>{item.user_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {item.first_name} {item.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.email || item.username || "-"}
                      </Typography>
                    </TableCell>

                    <TableCell>{item.role_name || "-"}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Switch
                          checked={item.is_active === 1}
                          onChange={(e) =>
                            handleStatusActiveUsers(
                              item.user_id,
                              e.target.checked,
                            )
                          }
                        />

                        <Chip
                          label={
                            item.is_active === 1 ? "พร้อมใช้งาน" : "ปิดใช้งาน"
                          }
                          size="small"
                          color={item.is_active === 1 ? "success" : "default"}
                          variant={item.is_active === 1 ? "filled" : "outlined"}
                        />
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedUserID(item.user_id);
                            setOpenEditUserDialog(true);
                          }}
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(item.user_id)}
                        >
                          ลบ
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {userData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      ไม่พบข้อมูลผู้ใช้
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            spacing={1.5}
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            {paginatedUsers.map((item) => (
              <Paper
                key={item.user_id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        ชื่อผู้ใช้
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.first_name} {item.last_name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {item.email || item.username || "-"}
                      </Typography>
                    </Box>

                    <Chip
                      label={`ID: ${item.user_id}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      บทบาท
                    </Typography>
                    <Typography fontWeight={500}>
                      {item.role_name || "-"}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        สถานะ
                      </Typography>
                      <Typography fontWeight={500}>
                        {item.is_active === 1 ? "พร้อมใช้งาน" : "ปิดใช้งาน"}
                      </Typography>
                    </Box>

                    <Switch
                      checked={item.is_active === 1}
                      onChange={(e) =>
                        handleStatusActiveUsers(item.user_id, e.target.checked)
                      }
                    />
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setSelectedUserID(item.user_id);
                        setOpenEditUserDialog(true);
                      }}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleDelete(item.user_id)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {userData.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  ไม่พบข้อมูลผู้ใช้
                </Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={userData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="แถวต่อหน้า"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} จาก ${count}`
            }
            sx={{
              mt: 2,
              ".MuiTablePagination-toolbar": {
                px: { xs: 0, sm: 2 },
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 1,
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  m: 0,
                },
            }}
          />
        </Paper>
      </Box>
    </>
  );
}

export default Manageuser;
