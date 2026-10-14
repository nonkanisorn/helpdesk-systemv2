import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { hasPermission } from "../../auth/permissions";
import {
  technicianNeutralButtonSx,
  technicianPrimaryButtonSx,
  technicianStatusButtonSx,
} from "../technician/buttonStyles";
function Statuscase() {
  const user_id = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);
  const permissions = useSelector((state) => state.user.permissions);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [ticketData, setticketData] = useState([]);
  const [reFresh, setRefresh] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [rejectingTicketId, setRejectingTicketId] = useState(null);
  const navigate = useNavigate();
  const canConfirmRepair = hasPermission(permissions, "confirm_repair");

  const statusMap = {
    1: "แจ้งปัญหาใหม่",
    2: "มอบหมายให้ช่าง",
    3: "กำลังทำ",
    4: "ทำเสร็จแล้วรอการยืนยัน",
    5: "เสร็จสิ้น",
    6: "รออะไหล่",
    7: "รอผู้จัดการตรวจสอบ",
  };

  const topagedetail = (ticket_id) => {
    navigate(`/user/repair-detail/${ticket_id}`);
  };

  const updatestatusticket = (ticket_id) => {
    axios
      .patch(
        `${apiUrl}/tickets/${ticket_id}/confirmation`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((result) => {
        console.log(result);
        setNotification({
          open: true,
          severity: "success",
          message: "ยืนยันการซ่อมสำเร็จ",
        });
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        setNotification({
          open: true,
          severity: "error",
          message: "ยืนยันการซ่อมไม่สำเร็จ",
        });
      });
  };

  const rejectRepairTicket = (ticket_id) => {
    axios
      .patch(
        `${apiUrl}/tickets/${ticket_id}/reject-repair`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setNotification({
          open: true,
          severity: "success",
          message: "ส่งกลับให้ผู้จัดการตรวจสอบแล้ว",
        });
        setRejectingTicketId(null);
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        setNotification({
          open: true,
          severity: "error",
          message: "ส่งกลับให้เมเนเจอร์ไม่สำเร็จ",
        });
      });
  };

  useEffect(() => {
    if (!token || !user_id) return;

    axios
      .get(`${apiUrl}/tickets/users/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        setticketData(response.data.result ?? response.data ?? []);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }, [apiUrl, reFresh, token, user_id]);

  return (
    <>
      <Typography variant="h3">สถานะการแจ้งซ่อม</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>ชื่องาน</TableCell>
              <TableCell>รายละเอียดงาน</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>เพิ่มเติม</TableCell>
              <TableCell>ยืนยันการซ่อม</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketData.map((item, index) => {
              const statusId = Number(item.status_id);

              return statusId === 5 ? null : (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {item.title}
                  </TableCell>

                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {item.status_name ?? statusMap[statusId] ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => topagedetail(item.ticket_id)}
                      sx={technicianPrimaryButtonSx}
                    >
                      เพิ่มเติม
                    </Button>
                  </TableCell>
                  <TableCell>
                    {canConfirmRepair && statusId === 4 ? (
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Button
                          onClick={() => {
                            if (window.confirm("ยืนยันการซ่อม")) {
                              updatestatusticket(item.ticket_id);
                            }
                          }}
                          variant="contained"
                          color="success"
                          sx={technicianStatusButtonSx}
                        >
                          ยืนยันการซ่อม
                        </Button>

                        <Button
                          onClick={() => setRejectingTicketId(item.ticket_id)}
                          variant="outlined"
                          color="error"
                          sx={technicianStatusButtonSx}
                        >
                          ไม่ยอมรับผลซ่อม
                        </Button>
                      </Box>
                    ) : statusId !== 5 ? (
                      <Button
                        variant="contained"
                        color="error"
                        sx={technicianStatusButtonSx}
                        onClick={() =>
                          setNotification({
                            open: true,
                            severity: "error",
                            message: "ยังไม่สามารถยืนยันการซ่อมได้",
                          })
                        }
                      >
                        ยืนยันการซ่อม
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(rejectingTicketId)}
        onClose={() => setRejectingTicketId(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>ไม่ยอมรับผลการซ่อม</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            งานนี้จะถูกส่งกลับให้ผู้จัดการตรวจสอบ และมอบหมายช่างเพื่อดำเนินการอีกครั้ง
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRejectingTicketId(null)}
            color="inherit"
            sx={technicianNeutralButtonSx}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => rejectRepairTicket(rejectingTicketId)}
            sx={technicianStatusButtonSx}
          >
            ส่งกลับให้ผู้จัดการตรวจสอบ
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() =>
            setNotification((prev) => ({ ...prev, open: false }))
          }
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
export default Statuscase;
