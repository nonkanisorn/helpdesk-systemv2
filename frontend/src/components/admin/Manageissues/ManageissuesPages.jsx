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
} from "@mui/material";
import AddIssuesCategoriesDialog from "../dialog/AddDialog/AddIssuesCategoriesDialog";
import EditIssuesCategoriesDialog from "../dialog/EditDialog/EditIssuesCategories";
import { useSelector } from "react-redux";

function ManageissuesPages() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [issuesCategoriesData, setIssuesCategoriesData] = useState([]);
  const [openAddIssuesCategoriesDialog, setOpenAddIssuesCategoriesDialog] =
    useState(false);
  const [openEditIssuesCategoriesDialog, setOpenEditIssuesCategoriesDialog] =
    useState(false);
  const [selectedIssuesCategory, setSelectedIssuesCategory] = useState(null);

  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchIssuesCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/issues-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIssuesCategoriesData(
        response.data.data ?? response.data.result ?? response.data ?? [],
      );
    } catch (error) {
      console.error("Error fetching issues categories:", error);
    }
  };

  useEffect(() => {
    if (token) fetchIssuesCategories();
  }, [token]);

  const handleOpenEditIssuesCategoriesDialog = (item) => {
    setSelectedIssuesCategory(item);
    setOpenEditIssuesCategoriesDialog(true);
  };

  const handleCloseEditIssuesCategoriesDialog = () => {
    setOpenEditIssuesCategoriesDialog(false);
    setSelectedIssuesCategory(null);
  };

  const handleDeleteIssuesCategory = async (id) => {
    console.log(id);
    const shouldDelete = window.confirm("ต้องการลบประเภทปัญหานี้ใช่ไหม?");
    if (!shouldDelete) return;

    try {
      await axios.delete(`${apiUrl}/issues-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchIssuesCategories();
    } catch (error) {
      console.error("Error deleting issues category:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedIssuesCategories = issuesCategoriesData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <AddIssuesCategoriesDialog
        open={openAddIssuesCategoriesDialog}
        onClose={() => setOpenAddIssuesCategoriesDialog(false)}
        onSuccess={fetchIssuesCategories}
        token={token}
      />

      <EditIssuesCategoriesDialog
        open={openEditIssuesCategoriesDialog}
        onClose={handleCloseEditIssuesCategoriesDialog}
        onSuccess={fetchIssuesCategories}
        token={token}
        issueCategory={selectedIssuesCategory}
      />

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
                จัดการประเภทปัญหา
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่ม แก้ไข และลบประเภทปัญหาในระบบแจ้งซ่อม
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setOpenAddIssuesCategoriesDialog(true)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              + เพิ่มประเภทปัญหา
            </Button>
          </Stack>

          <TableContainer
            sx={{
              display: { xs: "none", md: "block" },
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ชื่อประเภทปัญหา</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedIssuesCategories.map((item) => (
                  <TableRow key={item.issues_id} hover>
                    <TableCell>{item.issues_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {item.issues_name}
                      </Typography>
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
                          onClick={() =>
                            handleOpenEditIssuesCategoriesDialog(item.issues_id)
                          }
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() =>
                            handleDeleteIssuesCategory(item.issues_id)
                          }
                        >
                          ลบ
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {issuesCategoriesData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      ไม่พบข้อมูลประเภทปัญหา
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
            {paginatedIssuesCategories.map((item) => (
              <Paper
                key={item.issues_id}
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
                        ชื่อประเภทปัญหา
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.issues_name}
                      </Typography>
                    </Box>

                    <Chip
                      label={`ID: ${item.issues_id}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleOpenEditIssuesCategoriesDialog(item)}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleDeleteIssuesCategory(item.issues_id)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {issuesCategoriesData.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  ไม่พบข้อมูลประเภทปัญหา
                </Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={issuesCategoriesData.length}
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

export default ManageissuesPages;
