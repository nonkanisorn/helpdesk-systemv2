import { useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Divider,
  TablePagination,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  technicianNeutralButtonSx,
  technicianPrimaryButtonSx,
  technicianSecondaryButtonSx,
  technicianStatusButtonSx,
} from "./buttonStyles";

const DeviceDetailPages = ({
  historyPath = (instanceId) => `/technician/instance/${instanceId}/history`,
} = {}) => {
  const { dev_id } = useParams();
  const deviceId = Number(dev_id);

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [deviceDetail, setDeviceDetail] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);

  const [searchSerial, setSearchSerial] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
  } = useForm({
    defaultValues: { serial_number: "", dep_id: "", status: "active" },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
  } = useForm({
    defaultValues: { serial_number: "", dep_id: "", status: "active" },
  });

  const normalizeArray = (payload) => {
    const data = payload?.data ?? payload?.result ?? payload;

    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return [data];

    return [];
  };

  const normalizeInstances = (payload) =>
    normalizeArray(payload).map((item) => ({
      ...item,
      device_instance_id: item.device_instance_id ?? item.instance_id ?? item.id,
      instance_id: item.instance_id ?? item.device_instance_id ?? item.id,
      dep_id: item.dep_id ?? item.department_id,
      department_id: item.department_id ?? item.dep_id,
      status: item.status ?? "active",
    }));

  const normalizeDevices = (payload) =>
    normalizeArray(payload).map((item) => ({
      ...item,
      dev_id: item.dev_id ?? item.id,
      dev_name: item.dev_name ?? item.name,
      dev_description: item.dev_description ?? item.description,
    }));

  const getActionErrorMessage = (err, fallback) =>
    err.response?.data?.error ?? err.response?.data?.message ?? fallback;

  const getInstanceId = (row) =>
    row?.device_instance_id ?? row?.instance_id ?? row?.id;

  const getDepartmentName = (depId) => {
    if (!depId) return "-";

    const found = departments.find(
      (item) => Number(item.dep_id) === Number(depId),
    );

    return found?.dep_name ?? "-";
  };

  const getStatusLabel = (status) =>
    status === "inactive" ? "ไม่ใช้งาน" : "ใช้งาน";

  const getStatusColor = (status) =>
    status === "inactive" ? "default" : "success";

  const fetchDeviceDetail = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/device-instances/device/${deviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setDeviceDetail(normalizeInstances(res.data));
      setError(null);
    } catch (err) {
      console.error("Error fetching device detail:", err);

      if (err.response?.status === 404) {
        setDeviceDetail([]);
        setError(null);
        return;
      }

      setError(err);
    }
  };

  const fetchDeviceInfo = async () => {
    try {
      const res = await axios.get(`${apiUrl}/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const devices = normalizeDevices(res.data);
      setDeviceInfo(
        devices.find((item) => Number(item.dev_id) === Number(deviceId)) ??
          null,
      );
    } catch (err) {
      console.error("Error fetching device info:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${apiUrl}/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDepartments(normalizeArray(res.data));
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err);
    }
  };

  useEffect(() => {
    if (token && deviceId) {
      fetchDeviceDetail();
      fetchDeviceInfo();
    }
  }, [token, deviceId, refreshKey]);

  useEffect(() => {
    if (token) fetchDepartments();
  }, [token]);

  const filtered = useMemo(() => {
    const safeDeviceDetail = Array.isArray(deviceDetail) ? deviceDetail : [];

    return safeDeviceDetail.filter((item) => {
      const matchSearch =
        !searchSerial.trim() ||
        String(item.serial_number ?? "")
          .toLowerCase()
          .includes(searchSerial.trim().toLowerCase());

      const matchStatus =
        statusFilter === "all" || (item.status ?? "active") === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [deviceDetail, searchSerial, statusFilter]);

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const firstInstance = Array.isArray(deviceDetail) ? deviceDetail[0] : null;

  const openAdd = () => {
    resetAddForm({ serial_number: "", dep_id: "" });
    setOpenAddDialog(true);
  };

  const closeAdd = () => {
    resetAddForm({ serial_number: "", dep_id: "" });
    setOpenAddDialog(false);
  };

  const openEdit = (row) => {
    setSelectedInstance(row);

    resetEditForm({
      serial_number: row.serial_number ?? "",
      dep_id: row.dep_id ? Number(row.dep_id) : "",
      status: row.status ?? "active",
    });

    setOpenEditDialog(true);
  };

  const closeEdit = () => {
    setSelectedInstance(null);
    resetEditForm({ serial_number: "", dep_id: "", status: "active" });
    setOpenEditDialog(false);
  };

  const onAddSubmit = async (data) => {
    try {
      await axios.post(
        `${apiUrl}/device-instances`,
        {
          device_id: deviceId,
          serial_number: data.serial_number.trim(),
          dep_id: data.dep_id ? Number(data.dep_id) : null,
          department_id: data.dep_id ? Number(data.dep_id) : null,
          status: data.status === "inactive" ? "inactive" : "active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRefreshKey((prev) => prev + 1);
      setPage(0);
      closeAdd();
    } catch (err) {
      console.error("Error adding instance:", err);
      alert(getActionErrorMessage(err, "เพิ่มรายการอุปกรณ์ไม่สำเร็จ"));
    }
  };

  const onEditSubmit = async (data) => {
    if (!selectedInstance) return;

    try {
      await axios.patch(
        `${apiUrl}/device-instances/${getInstanceId(selectedInstance)}`,
        {
          serial_number: data.serial_number.trim(),
          dep_id: data.dep_id ? Number(data.dep_id) : null,
          department_id: data.dep_id ? Number(data.dep_id) : null,
          status: data.status === "inactive" ? "inactive" : "active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRefreshKey((prev) => prev + 1);
      closeEdit();
    } catch (err) {
      console.error("Error editing instance:", err);
      alert(getActionErrorMessage(err, "แก้ไขรายการอุปกรณ์ไม่สำเร็จ"));
    }
  };

  const toggleInstanceStatus = async (row) => {
    const instanceId = getInstanceId(row);
    if (!instanceId) return;

    const currentStatus = row.status === "inactive" ? "inactive" : "active";
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    const actionLabel = nextStatus === "active" ? "เปิดใช้งาน" : "ไม่ใช้งาน";

    const shouldChange = window.confirm(
      `ต้องการ${actionLabel}รายการอุปกรณ์นี้ใช่ไหม?`,
    );
    if (!shouldChange) return;

    try {
      await axios.patch(
        `${apiUrl}/device-instances/${instanceId}`,
        {
          serial_number: String(row.serial_number ?? "").trim(),
          dep_id: row.dep_id ? Number(row.dep_id) : null,
          department_id: row.dep_id ? Number(row.dep_id) : null,
          status: nextStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error changing instance status:", err);
      alert(getActionErrorMessage(err, "เปลี่ยนสถานะรายการอุปกรณ์ไม่สำเร็จ"));
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={2}
          sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
        >
          <Typography color="error">โหลดข้อมูลล้มเหลว</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <Dialog open={openAddDialog} onClose={closeAdd} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                เพิ่มรายการอุปกรณ์
              </Typography>
              <Typography variant="body2" color="text.secondary">
                เพิ่ม Serial Number และแผนกที่ใช้งาน
              </Typography>
            </Box>

            <Button onClick={closeAdd} color="inherit" sx={technicianNeutralButtonSx}>
              ✕
            </Button>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="form-add"
            onSubmit={handleAddSubmit(onAddSubmit)}
          >
            <Stack spacing={3}>
              <Controller
                name="serial_number"
                control={addControl}
                rules={{ required: "กรุณากรอกรหัสอุปกรณ์" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="รหัสอุปกรณ์"
                    placeholder="เช่น SN-001"
                    fullWidth
                    autoFocus
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || " "}
                  />
                )}
              />

              <Controller
                name="dep_id"
                control={addControl}
                render={({ field }) => (
                  <TextField {...field} select label="แผนกที่ใช้งาน" fullWidth>
                    <MenuItem value="">
                      <em>ไม่ระบุ</em>
                    </MenuItem>

                    {departments.map((item) => (
                      <MenuItem key={item.dep_id} value={Number(item.dep_id)}>
                        {item.dep_name}
                      </MenuItem>
                    ))}
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
            onClick={closeAdd}
            color="inherit"
            sx={{ ...technicianNeutralButtonSx, width: { xs: "100%", sm: "auto" } }}
          >
            ยกเลิก
          </Button>

          <Button
            type="submit"
            form="form-add"
            variant="contained"
            sx={{ ...technicianPrimaryButtonSx, width: { xs: "100%", sm: "auto" } }}
          >
            เพิ่มรายการ
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                แก้ไขรายการอุปกรณ์
              </Typography>
              <Typography variant="body2" color="text.secondary">
                แก้ไข Serial Number แผนกที่ใช้งาน และสถานะ
              </Typography>
            </Box>

            <Button onClick={closeEdit} color="inherit" sx={technicianNeutralButtonSx}>
              ✕
            </Button>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="form-edit"
            onSubmit={handleEditSubmit(onEditSubmit)}
          >
            <Stack spacing={3}>
              <Box
                sx={{
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  ข้อมูลเดิม
                </Typography>

                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedInstance?.serial_number ?? "-"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  แผนก: {getDepartmentName(selectedInstance?.dep_id)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  สถานะ: {getStatusLabel(selectedInstance?.status)}
                </Typography>
              </Box>

              <Controller
                name="serial_number"
                control={editControl}
                rules={{ required: "กรุณากรอกรหัสอุปกรณ์" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="รหัสอุปกรณ์"
                    fullWidth
                    autoFocus
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || " "}
                  />
                )}
              />

              <Controller
                name="dep_id"
                control={editControl}
                render={({ field }) => (
                  <TextField {...field} select label="แผนกที่ใช้งาน" fullWidth>
                    <MenuItem value="">
                      <em>ไม่ระบุ</em>
                    </MenuItem>

                    {departments.map((item) => (
                      <MenuItem key={item.dep_id} value={Number(item.dep_id)}>
                        {item.dep_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="status"
                control={editControl}
                render={({ field }) => (
                  <TextField {...field} select label="สถานะ" fullWidth>
                    <MenuItem value="active">ใช้งาน</MenuItem>
                    <MenuItem value="inactive">ไม่ใช้งาน</MenuItem>
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
            onClick={closeEdit}
            color="inherit"
            sx={{ ...technicianNeutralButtonSx, width: { xs: "100%", sm: "auto" } }}
          >
            ยกเลิก
          </Button>

          <Button
            type="submit"
            form="form-edit"
            variant="contained"
            sx={{ ...technicianPrimaryButtonSx, width: { xs: "100%", sm: "auto" } }}
          >
            บันทึกการแก้ไข
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
                รายละเอียดอุปกรณ์
              </Typography>

              <Typography variant="body2" color="text.secondary">
                จัดการรายการอุปกรณ์ย่อย Serial Number และแผนกที่ใช้งาน
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={openAdd}
              sx={{ ...technicianPrimaryButtonSx, width: { xs: "100%", sm: "auto" } }}
            >
              + เพิ่มรายการอุปกรณ์
            </Button>
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, mb: 3 }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1.5}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    อุปกรณ์
                  </Typography>

                  <Typography fontWeight={600}>
                    {deviceInfo?.dev_name ??
                      firstInstance?.device_name ??
                      `Device ID: ${deviceId}`}
                  </Typography>
                </Box>

                <Chip
                  label={`ทั้งหมด: ${filtered.length}`}
                  color="info"
                  variant="outlined"
                  sx={{ width: { xs: "100%", sm: "fit-content" } }}
                />
              </Stack>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  รายละเอียดอุปกรณ์
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                  }}
                >
                  {deviceInfo?.dev_description ??
                    firstInstance?.device_description ??
                    "-"}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <TextField
            value={searchSerial}
            onChange={(e) => {
              setSearchSerial(e.target.value);
              setPage(0);
            }}
            label="ค้นหารหัสอุปกรณ์"
            placeholder="ค้นหาด้วย Serial Number"
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            select
            label="สถานะ"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            sx={{ mb: 3, minWidth: { xs: "100%", sm: 220 } }}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            <MenuItem value="active">ใช้งาน</MenuItem>
            <MenuItem value="inactive">ไม่ใช้งาน</MenuItem>
          </TextField>

          <TableContainer
            sx={{ display: { xs: "none", md: "block" }, overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>รหัสอุปกรณ์</TableCell>
                  <TableCell>แผนกที่ใช้งาน</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginated.map((row, index) => (
                  <TableRow key={getInstanceId(row) ?? index} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {row.serial_number ?? "-"}
                      </Typography>
                    </TableCell>

                    <TableCell>{getDepartmentName(row.dep_id)}</TableCell>

                    <TableCell>
                      <Chip
                        label={getStatusLabel(row.status)}
                        color={getStatusColor(row.status)}
                        size="small"
                        variant={
                          row.status === "inactive" ? "outlined" : "filled"
                        }
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          component={Link}
                          to={historyPath(getInstanceId(row))}
                          variant="outlined"
                          size="small"
                          disabled={!getInstanceId(row)}
                          sx={technicianSecondaryButtonSx}
                        >
                          ประวัติการซ่อม
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => openEdit(row)}
                          sx={technicianSecondaryButtonSx}
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          color={row.status === "inactive" ? "success" : "error"}
                          size="small"
                          onClick={() => toggleInstanceStatus(row)}
                          disabled={!getInstanceId(row)}
                          sx={technicianStatusButtonSx}
                        >
                          {row.status === "inactive"
                            ? "เปิดใช้งาน"
                            : "ไม่ใช้งาน"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      ยังไม่มีรายการอุปกรณ์
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
            {paginated.map((row, index) => (
              <Paper
                key={getInstanceId(row) ?? index}
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
                        รหัสอุปกรณ์
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{ mt: 0.25, wordBreak: "break-word" }}
                      >
                        {row.serial_number ?? "-"}
                      </Typography>
                    </Box>

                    <Chip
                      label={`ID: ${getInstanceId(row) ?? "-"}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      แผนกที่ใช้งาน
                    </Typography>

                    <Typography variant="body2" fontWeight={500}>
                      {getDepartmentName(row.dep_id)}
                    </Typography>
                  </Stack>

                  <Chip
                    label={getStatusLabel(row.status)}
                    color={getStatusColor(row.status)}
                    size="small"
                    variant={row.status === "inactive" ? "outlined" : "filled"}
                    sx={{ alignSelf: "flex-start" }}
                  />

                  <Divider />

                  <Button
                    component={Link}
                    to={historyPath(getInstanceId(row))}
                    variant="outlined"
                    fullWidth
                    disabled={!getInstanceId(row)}
                    sx={technicianSecondaryButtonSx}
                  >
                    ประวัติการซ่อม
                  </Button>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => openEdit(row)}
                      sx={technicianSecondaryButtonSx}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color={row.status === "inactive" ? "success" : "error"}
                      fullWidth
                      onClick={() => toggleInstanceStatus(row)}
                      disabled={!getInstanceId(row)}
                      sx={technicianStatusButtonSx}
                    >
                      {row.status === "inactive" ? "เปิดใช้งาน" : "ไม่ใช้งาน"}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {filtered.length === 0 && (
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2.5, textAlign: "center" }}
              >
                <Typography color="text.secondary">
                  ยังไม่มีรายการอุปกรณ์
                </Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
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
};

export default DeviceDetailPages;
