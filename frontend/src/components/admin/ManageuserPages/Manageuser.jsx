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
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
    department_id: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({ defaultValues, mode: "onChange" });

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
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          role_id: data.role_id,
          department_id: data.department_id,
          status: "pending",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      reset(defaultValues);
      setOpenAddUserDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error.response?.data || error);
      alert(error.response?.data?.error || "เพิ่มผู้ใช้ไม่สำเร็จ");
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

  const getStatusLabel = (item) => {
    if (item.status === "pending") return "รอตั้งรหัสผ่าน";
    if (item.status === "inactive" || item.is_active === 0) return "ปิดใช้งาน";
    return "พร้อมใช้งาน";
  };

  const getStatusColor = (item) => {
    if (item.status === "pending") return "warning";
    if (item.status === "inactive" || item.is_active === 0) return "default";
    return "success";
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
                เพิ่มบัญชีผู้ใช้งานใหม่ แล้วส่งลิงก์ให้ผู้ใช้ตั้งรหัสผ่านเอง
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
                  label="ชื่อ"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  error={!!errors.first_name}
                  helperText={errors.first_name ? "กรุณากรอกชื่อ" : " "}
                  {...register("first_name", { required: true })}
                />

                <TextField
                  label="นามสกุล"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  error={!!errors.last_name}
                  helperText={errors.last_name ? "กรุณากรอกนามสกุล" : " "}
                  {...register("last_name", { required: true })}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="อีเมล"
                  type="email"
                  fullWidth
                  required
                  disabled={loadingAddUser}
                  error={!!errors.email}
                  helperText={errors.email ? "กรุณากรอกอีเมล" : " "}
                  {...register("email", { required: true })}
                />

                <TextField
                  label="เบอร์โทรศัพท์"
                  fullWidth
                  disabled={loadingAddUser}
                  {...register("phone")}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Controller
                  control={control}
                  name="role_id"
                  rules={{ required: "กรุณาเลือกบทบาท" }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="บทบาท"
                      fullWidth
                      required
                      disabled={loadingAddUser}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={!!errors.role_id}
                      helperText={errors.role_id?.message || " "}
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
                  rules={{ required: "กรุณาเลือกแผนก" }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="แผนก"
                      fullWidth
                      required
                      disabled={loadingAddUser}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={!!errors.department_id}
                      helperText={errors.department_id?.message || " "}
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

              <Typography variant="body2" color="text.secondary">
                สถานะเริ่มต้น: รอตั้งรหัสผ่าน
              </Typography>
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
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
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
            sx={{ display: { xs: "none", md: "block" }, overflowX: "auto" }}
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
                        {item.email || "-"}
                      </Typography>
                    </TableCell>

                    <TableCell>{item.role_name || "-"}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {item.status !== "pending" && (
                          <Switch
                            checked={item.is_active === 1}
                            onChange={(e) =>
                              handleStatusActiveUsers(
                                item.user_id,
                                e.target.checked,
                              )
                            }
                          />
                        )}

                        <Chip
                          label={getStatusLabel(item)}
                          size="small"
                          color={getStatusColor(item)}
                          variant={
                            getStatusColor(item) === "default"
                              ? "outlined"
                              : "filled"
                          }
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

          <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
            {paginatedUsers.map((item) => (
              <Paper
                key={item.user_id}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2.5 }}
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
                        sx={{ mt: 0.25, wordBreak: "break-word" }}
                      >
                        {item.first_name} {item.last_name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {item.email || "-"}
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
                        {getStatusLabel(item)}
                      </Typography>
                    </Box>

                    {item.status !== "pending" && (
                      <Switch
                        checked={item.is_active === 1}
                        onChange={(e) =>
                          handleStatusActiveUsers(
                            item.user_id,
                            e.target.checked,
                          )
                        }
                      />
                    )}
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
                sx={{ p: 3, borderRadius: 2.5, textAlign: "center" }}
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
