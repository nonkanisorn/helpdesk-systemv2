import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useSelector } from "react-redux";
import { getErrorMessage, useAdminFeedback } from "../useAdminFeedback";

const allResourceType = "all";

const formatDeletedAt = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function RestoreDeletedItems({
  listEndpoint = "/admin/deleted-items",
  restoreEndpoint = (item) =>
    `/admin/deleted-items/${item.resource_type}/${item.id}/restore`,
  title = "กู้คืนข้อมูลที่ถูกลบ",
  subtitle = "ดูและกู้คืนข้อมูลที่ถูกลบออกจากรายการใช้งาน",
} = {}) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);
  const { showFeedback, FeedbackSnackbar } = useAdminFeedback();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringKey, setRestoringKey] = useState("");
  const [resourceType, setResourceType] = useState(allResourceType);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchDeletedItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}${listEndpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data.result ?? []);
    } catch (error) {
      console.error("Error fetching deleted items:", error);
      showFeedback(
        "error",
        getErrorMessage(error, "ไม่สามารถโหลดรายการที่ถูกลบได้"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDeletedItems();
    }
  }, [token]);

  const resourceOptions = useMemo(() => {
    const labelsByType = new Map();
    items.forEach((item) => {
      labelsByType.set(item.resource_type, item.resource_label);
    });

    return Array.from(labelsByType.entries()).map(([type, label]) => ({
      type,
      label,
    }));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (resourceType === allResourceType) return items;
    return items.filter((item) => item.resource_type === resourceType);
  }, [items, resourceType]);

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangeResourceType = (event) => {
    setResourceType(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRestore = async (item) => {
    const ok = window.confirm(
      `ต้องการกู้คืน${item.resource_label} "${item.name}" ใช่ไหม?`,
    );
    if (!ok) return;

    const restoreKey = `${item.resource_type}-${item.id}`;

    try {
      setRestoringKey(restoreKey);
      await axios.patch(
        `${apiUrl}${restoreEndpoint(item)}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      showFeedback("success", `กู้คืน${item.resource_label}เรียบร้อยแล้ว`);
      await fetchDeletedItems();
    } catch (error) {
      console.error("Error restoring item:", error);
      showFeedback(
        "error",
        getErrorMessage(error, `ไม่สามารถกู้คืน${item.resource_label}ได้`),
      );
    } finally {
      setRestoringKey("");
    }
  };

  return (
    <>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id="restore-resource-filter-label">
                  ประเภทข้อมูล
                </InputLabel>
                <Select
                  labelId="restore-resource-filter-label"
                  value={resourceType}
                  label="ประเภทข้อมูล"
                  onChange={handleChangeResourceType}
                >
                  <MenuItem value={allResourceType}>ทั้งหมด</MenuItem>
                  {resourceOptions.map((option) => (
                    <MenuItem key={option.type} value={option.type}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<RefreshOutlinedIcon />}
                onClick={fetchDeletedItems}
                disabled={loading}
              >
                รีเฟรช
              </Button>
            </Stack>
          </Stack>

          <TableContainer
            sx={{
              display: { xs: "none", md: "block" },
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ประเภท</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>ชื่อข้อมูล</TableCell>
                  <TableCell>รายละเอียด</TableCell>
                  <TableCell>วันที่ลบ</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedItems.map((item) => {
                  const restoreKey = `${item.resource_type}-${item.id}`;

                  return (
                    <TableRow key={restoreKey} hover>
                      <TableCell>
                        <Chip
                          label={item.resource_label}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>{item.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 320,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.description || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDeletedAt(item.deleted_at)}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<RestoreFromTrashOutlinedIcon />}
                          onClick={() => handleRestore(item)}
                          disabled={restoringKey === restoreKey}
                        >
                          กู้คืน
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!loading && filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      ไม่พบข้อมูลที่ถูกลบ
                    </TableCell>
                  </TableRow>
                )}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      กำลังโหลดข้อมูล...
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
            {paginatedItems.map((item) => {
              const restoreKey = `${item.resource_type}-${item.id}`;

              return (
                <Paper
                  key={restoreKey}
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
                          {item.resource_label}
                        </Typography>

                        <Typography
                          fontWeight={600}
                          sx={{
                            mt: 0.25,
                            wordBreak: "break-word",
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>

                      <Chip
                        label={`ID: ${item.id}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Divider />

                    <Stack spacing={0.75}>
                      <Typography variant="body2" color="text.secondary">
                        รายละเอียด: {item.description || "-"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        วันที่ลบ: {formatDeletedAt(item.deleted_at)}
                      </Typography>
                    </Stack>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<RestoreFromTrashOutlinedIcon />}
                      onClick={() => handleRestore(item)}
                      disabled={restoringKey === restoreKey}
                    >
                      กู้คืน
                    </Button>
                  </Stack>
                </Paper>
              );
            })}

            {!loading && filteredItems.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  ไม่พบข้อมูลที่ถูกลบ
                </Typography>
              </Paper>
            )}

            {loading && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">กำลังโหลดข้อมูล...</Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={filteredItems.length}
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
      <FeedbackSnackbar />
    </>
  );
}

export default RestoreDeletedItems;
