import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import AddDeviceDialog from "../shareDialog/AddDialog/AddDeviceDialog";
import EditDeviceDialog from "../shareDialog/EditDialog/EditDeviceDialog";

const ManageDevice = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [device, setDevice] = useState([]);
  const [typeDevice, setTypeDevice] = useState([]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");
  const [newDeviceDescription, setNewDeviceDescription] = useState("");

  const [editDeviceName, setEditDeviceName] = useState("");
  const [editDeviceType, setEditDeviceType] = useState("");
  const [editDeviceDescription, setEditDeviceDescription] = useState("");

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const normalizeDeviceTypes = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : (payload?.data ?? payload?.result ?? []);

    return list.map((item) => ({
      ...item,
      devicetype_id: item.devicetype_id ?? item.id ?? item.device_type_id,
      devicetype_name:
        item.devicetype_name ?? item.name ?? item.device_type_name,
    }));
  };

  const getDeviceTypeName = (typeId) => {
    const found = typeDevice.find(
      (item) => Number(item.devicetype_id) === Number(typeId),
    );

    return found?.devicetype_name ?? "-";
  };

  const filteredDevice = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return device.filter((item) => {
      const matchSearch =
        !keyword ||
        String(item.dev_name ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.dev_id ?? "")
          .toLowerCase()
          .includes(keyword);

      const matchType =
        typeFilter === "all" || Number(item.dev_type) === Number(typeFilter);

      return matchSearch && matchType;
    });
  }, [device, searchText, typeFilter]);

  const paginatedDevice = filteredDevice.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${apiUrl}/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDevice(res.data.result ?? res.data.data ?? res.data ?? []);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const res = await axios.get(`${apiUrl}/device-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTypeDevice(normalizeDeviceTypes(res.data));
    } catch (error) {
      console.error("Error fetching device types:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDevices();
      fetchDeviceTypes();
    }
  }, [token]);

  const handleAddDevice = async () => {
    if (!newDeviceName.trim() || !newDeviceType) return;

    try {
      await axios.post(
        `${apiUrl}/devices`,
        {
          dev_name: newDeviceName.trim(),
          dev_type: Number(newDeviceType),
          dev_description: newDeviceDescription.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setOpenAddDialog(false);
      setNewDeviceName("");
      setNewDeviceType("");
      setNewDeviceDescription("");
      setPage(0);
      fetchDevices();
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleOpenEditDialog = (item) => {
    setSelectedDevice(item);
    setEditDeviceName(item.dev_name ?? "");
    setEditDeviceType(item.dev_type ?? "");
    setEditDeviceDescription(item.dev_description ?? "");
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedDevice(null);
    setEditDeviceName("");
    setEditDeviceType("");
    setEditDeviceDescription("");
  };

  const handleEditDevice = async () => {
    if (!editDeviceName.trim() || !selectedDevice?.dev_id) return;

    try {
      await axios.put(
        `${apiUrl}/devices/${selectedDevice.dev_id}`,
        {
          newdevicename: editDeviceName.trim(),
          dev_type: Number(editDeviceType),
          dev_description: editDeviceDescription.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      handleCloseEditDialog();
      fetchDevices();
    } catch (error) {
      console.error("Error editing device:", error);
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm("ต้องการลบอุปกรณ์นี้ใช่ไหม?")) return;

    try {
      await axios.delete(`${apiUrl}/devices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              จัดการอุปกรณ์
            </Typography>

            <Typography color="text.secondary">
              เพิ่ม แก้ไข ลบ และดูรายการอุปกรณ์ในระบบ
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setOpenAddDialog(true)}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            + เพิ่มอุปกรณ์
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
            label="ค้นหาอุปกรณ์"
            placeholder="ค้นหาด้วยชื่ออุปกรณ์ หรือ ID"
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <FormControl sx={{ minWidth: { xs: "100%", md: 260 } }}>
            <InputLabel>ประเภทอุปกรณ์</InputLabel>
            <Select
              value={typeFilter}
              label="ประเภทอุปกรณ์"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">ทุกประเภท</MenuItem>
              {typeDevice.map((item) => (
                <MenuItem
                  key={item.devicetype_id}
                  value={String(item.devicetype_id)}
                >
                  {item.devicetype_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ชื่อ</TableCell>
                <TableCell>ประเภท</TableCell>
                <TableCell align="center">จำนวน</TableCell>
                <TableCell align="right">จัดการ</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedDevice.map((item) => (
                <TableRow key={item.dev_id} hover>
                  <TableCell>{item.dev_id}</TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{item.dev_name}</Typography>

                    {item.dev_description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.25,
                          maxWidth: 320,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.dev_description}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getDeviceTypeName(item.dev_type)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={item.numberofinstancedevice ?? 0}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
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
                        onClick={() => handleOpenEditDialog(item)}
                      >
                        แก้ไข
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteDevice(item.dev_id)}
                      >
                        ลบ
                      </Button>

                      <Button
                        component={Link}
                        to={`${item.dev_id}/instances`}
                        variant="outlined"
                        size="small"
                      >
                        รายการ
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filteredDevice.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ไม่พบข้อมูลอุปกรณ์
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack sx={{ display: { xs: "flex", md: "none" } }} spacing={2}>
          {paginatedDevice.map((item) => (
            <Paper
              key={item.dev_id}
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
                      ชื่ออุปกรณ์
                    </Typography>

                    <Typography
                      fontWeight={600}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {item.dev_name}
                    </Typography>
                  </Box>

                  <Chip
                    label={`ID: ${item.dev_id}`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    ประเภทอุปกรณ์
                  </Typography>

                  <Chip
                    label={getDeviceTypeName(item.dev_type)}
                    size="small"
                    variant="outlined"
                    sx={{ width: "fit-content" }}
                  />
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    รายละเอียดอุปกรณ์
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.dev_description || "-"}
                  </Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    จำนวนรายการอุปกรณ์
                  </Typography>

                  <Chip
                    label={item.numberofinstancedevice ?? 0}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{ width: "fit-content" }}
                  />
                </Stack>

                <Divider />

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleOpenEditDialog(item)}
                  >
                    แก้ไข
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleDeleteDevice(item.dev_id)}
                  >
                    ลบ
                  </Button>
                </Stack>

                <Button
                  component={Link}
                  to={`${item.dev_id}/instances`}
                  variant="outlined"
                  fullWidth
                >
                  รายการอุปกรณ์
                </Button>
              </Stack>
            </Paper>
          ))}

          {filteredDevice.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2.5,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">ไม่พบข้อมูลอุปกรณ์</Typography>
            </Paper>
          )}
        </Stack>

        <TablePagination
          component="div"
          count={filteredDevice.length}
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

      <AddDeviceDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddDevice}
        typeDevice={typeDevice}
        newDeviceName={newDeviceName}
        setNewDeviceName={setNewDeviceName}
        newDeviceType={newDeviceType}
        setNewDeviceType={setNewDeviceType}
        newDeviceDescription={newDeviceDescription}
        setNewDeviceDescription={setNewDeviceDescription}
      />

      <EditDeviceDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditDevice}
        device={selectedDevice}
        typeDevice={typeDevice}
        editDeviceName={editDeviceName}
        setEditDeviceName={setEditDeviceName}
        editDeviceType={editDeviceType}
        setEditDeviceType={setEditDeviceType}
        editDeviceDescription={editDeviceDescription}
        setEditDeviceDescription={setEditDeviceDescription}
      />
    </Box>
  );
};

export default ManageDevice;
