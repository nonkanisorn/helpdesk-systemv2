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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
  const [sendingPasswordLinkUserID, setSendingPasswordLinkUserID] =
    useState(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showFeedback = (severity, message) => {
    setFeedback({
      open: true,
      severity,
      message,
    });
  };

  const getErrorMessage = (error, fallback) => {
    const responseError = error.response?.data?.error;
    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }

    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    return fallback;
  };

  const normalizeUsers = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : (payload?.result ?? payload?.data ?? []);

    return list.map((item) => ({
      ...item,
      user_id: item.user_id ?? item.id,
      department_id: item.department_id ?? item.dep_id,
      role_name: item.role_name ?? "-",
      department_name: item.department_name ?? item.dep_name ?? "-",
      status: item.status ?? "inactive",
    }));
  };

  const normalizeRoles = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : (payload?.result ?? payload?.data ?? []);

    return list.map((item) => ({
      ...item,
      role_id: item.role_id ?? item.id,
      role_name: item.role_name ?? item.name,
    }));
  };

  const normalizeDepartments = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : (payload?.result ?? payload?.data ?? []);

    return list.map((item) => ({
      ...item,
      dep_id: item.dep_id ?? item.department_id ?? item.id,
      dep_name: item.dep_name ?? item.department_name ?? item.name,
    }));
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/view`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(normalizeUsers(response.data));
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

      setRoleData(normalizeRoles(roleRes.data));
      setDepData(normalizeDepartments(depRes.data));
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

  const handleStatusChange = async (userId, newStatus) => {
    const currentUser = userData.find((user) => user.user_id === userId);
    const previousStatus = currentUser?.status ?? "inactive";

    setUserData((prev) =>
      prev.map((user) =>
        user.user_id === userId ? { ...user, status: newStatus } : user,
      ),
    );

    try {
      await axios.patch(
        `${apiUrl}/users/${userId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      showFeedback(
        "success",
        newStatus === "active"
          ? "เปิดใช้งานผู้ใช้แล้ว"
          : "ปิดใช้งานผู้ใช้แล้ว",
      );
    } catch (error) {
      console.error("Error updating user status:", error);

      setUserData((prev) =>
        prev.map((user) =>
          user.user_id === userId ? { ...user, status: previousStatus } : user,
        ),
      );

      showFeedback(
        "error",
        getErrorMessage(error, "เปลี่ยนสถานะผู้ใช้ไม่สำเร็จ"),
      );
    }
  };

  const handleSendPasswordLink = async (user) => {
    if (!user?.email) {
      showFeedback("warning", "ผู้ใช้นี้ไม่มีอีเมล");
      return;
    }

    const actionText =
      user.status === "pending" ? "ส่งลิงก์ตั้งรหัสผ่านครั้งแรก" : "ส่งลิงก์รีเซ็ตรหัสผ่าน";

    try {
      setSendingPasswordLinkUserID(user.user_id);

      await axios.post(
        `${apiUrl}/forgot-password`,
        { email: user.email },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      showFeedback(
        "success",
        user.status === "pending"
          ? "ส่งลิงก์ตั้งรหัสผ่านครั้งแรกเรียบร้อยแล้ว"
          : "ส่งลิงก์รีเซ็ตรหัสผ่านเรียบร้อยแล้ว",
      );
    } catch (error) {
      console.error("Error sending password link:", error);
      showFeedback(
        "error",
        getErrorMessage(error, `${actionText}ไม่สำเร็จ`),
      );
    } finally {
      setSendingPasswordLinkUserID(null);
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
      showFeedback("success", "เพิ่มผู้ใช้เรียบร้อยแล้ว");
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error.response?.data || error);
      showFeedback("error", getErrorMessage(error, "เพิ่มผู้ใช้ไม่สำเร็จ"));
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
    if (item.status === "inactive") return "ไม่พร้อมใช้งาน";
    return "พร้อมใช้งาน";
  };

  const getStatusColor = (item) => {
    if (item.status === "pending") return "warning";
    if (item.status === "inactive") return "default";
    return "success";
  };

  const getStatusDescription = (item) => {
    if (item.status === "pending") return "ยังไม่ได้ตั้งรหัสผ่าน";
    if (item.status === "inactive") return "ถูกปิดการเข้าสู่ระบบ";
    return "เข้าสู่ระบบได้";
  };

  const getPasswordActionLabel = (item) => {
    if (item.status === "pending") return "ส่งลิงก์ตั้งรหัส";
    return "รีเซ็ตรหัสผ่าน";
  };

  const filteredUsers = userData.filter((item) => {
    const keyword = searchText.trim().toLowerCase();
    const fullName = `${item.first_name ?? ""} ${item.last_name ?? ""}`;
    const matchSearch =
      !keyword ||
      fullName.toLowerCase().includes(keyword) ||
      String(item.email ?? "").toLowerCase().includes(keyword) ||
      String(item.user_id ?? "").includes(keyword);
    const matchRole =
      roleFilter === "all" || Number(item.role_id) === Number(roleFilter);
    const matchStatus =
      statusFilter === "all" || String(item.status) === String(statusFilter);

    return matchSearch && matchRole && matchStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <EditUserDialog
        open={openEditUserDialog}
        onClose={handleCloseEditUserDialog}
        onSuccess={(msg) => {
          fetchUsers();
          if (typeof msg === "string") {
            showFeedback("success", msg);
          }
        }}
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
                เพิ่ม แก้ไข ส่งลิงก์ตั้งรหัสผ่าน และจัดการสถานะผู้ใช้งาน
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

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <TextField
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(0);
              }}
              label="ค้นหาผู้ใช้"
              placeholder="ค้นหาด้วยชื่อ อีเมล หรือ ID"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: { xs: "100%", md: 220 } }}>
              <InputLabel>บทบาท</InputLabel>
              <Select
                value={roleFilter}
                label="บทบาท"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">ทุกบทบาท</MenuItem>
                {roleData.map((item) => (
                  <MenuItem key={item.role_id} value={String(item.role_id)}>
                    {item.role_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: "100%", md: 220 } }}>
              <InputLabel>สถานะ</InputLabel>
              <Select
                value={statusFilter}
                label="สถานะ"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">ทุกสถานะ</MenuItem>
                <MenuItem value="pending">รอตั้งรหัสผ่าน</MenuItem>
                <MenuItem value="active">พร้อมใช้งาน</MenuItem>
                <MenuItem value="inactive">ไม่พร้อมใช้งาน</MenuItem>
              </Select>
            </FormControl>
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
                  <TableCell>แผนก</TableCell>
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

                    <TableCell>{item.department_name || "-"}</TableCell>

                    <TableCell>
                      <Stack spacing={0.5} alignItems="flex-start">
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
                        <Typography variant="caption" color="text.secondary">
                          {getStatusDescription(item)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={
                            sendingPasswordLinkUserID === item.user_id
                          }
                          onClick={() => handleSendPasswordLink(item)}
                        >
                          {sendingPasswordLinkUserID === item.user_id ? (
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <CircularProgress size={14} />
                              <span>กำลังส่ง...</span>
                            </Stack>
                          ) : (
                            getPasswordActionLabel(item)
                          )}
                        </Button>

                        {item.status !== "pending" && (
                          <Button
                            variant="outlined"
                            color={
                              item.status === "active" ? "warning" : "success"
                            }
                            size="small"
                            onClick={() =>
                              handleStatusChange(
                                item.user_id,
                                item.status === "active"
                                  ? "inactive"
                                  : "active",
                              )
                            }
                          >
                            {item.status === "active"
                              ? "ปิดใช้งาน"
                              : "เปิดใช้งาน"}
                          </Button>
                        )}

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
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      แผนก
                    </Typography>
                    <Typography fontWeight={500}>
                      {item.department_name || "-"}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        สถานะ
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {getStatusDescription(item)}
                      </Typography>
                    </Box>

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

                  <Divider />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled={sendingPasswordLinkUserID === item.user_id}
                      onClick={() => handleSendPasswordLink(item)}
                    >
                      {sendingPasswordLinkUserID === item.user_id ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <CircularProgress size={14} />
                          <span>กำลังส่ง...</span>
                        </Stack>
                      ) : (
                        getPasswordActionLabel(item)
                      )}
                    </Button>

                    {item.status !== "pending" && (
                      <Button
                        variant="outlined"
                        color={
                          item.status === "active" ? "warning" : "success"
                        }
                        fullWidth
                        onClick={() =>
                          handleStatusChange(
                            item.user_id,
                            item.status === "active" ? "inactive" : "active",
                          )
                        }
                      >
                        {item.status === "active"
                          ? "ปิดใช้งาน"
                          : "เปิดใช้งาน"}
                      </Button>
                    )}

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
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {filteredUsers.length === 0 && (
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
            count={filteredUsers.length}
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

      <Snackbar
        open={feedback.open}
        autoHideDuration={5000}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={feedback.severity}
          variant="filled"
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Manageuser;
