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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
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
  const [rejectReason, setRejectReason] = useState("");
  const navigate = useNavigate();
  const canConfirmRepair = hasPermission(permissions, "confirm_repair");

  const isRejectedTicket = (ticket) => {
    const statusId = Number(ticket?.status_id);
    if (statusId === 5) return false;

    return (
      statusId === 7 ||
      Boolean(ticket?.reassign_info?.user_rejection_reason)
    );
  };

  const statusMap = {
    1: "แจ้งปัญหาใหม่",
    2: "มอบหมายให้ช่าง",
    3: "กำลังทำ",
    4: "ทำเสร็จแล้วรอการยืนยัน",
    5: "เสร็จสิ้น",
    6: "รออะไหล่",
    7: "ส่งกลับตรวจสอบอีกครั้ง",
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
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setNotification({
        open: true,
        severity: "error",
        message: "กรุณาระบุเหตุผลที่ไม่ยอมรับผลการซ่อม",
      });
      return;
    }

    axios
      .patch(
        `${apiUrl}/tickets/${ticket_id}/reject-repair`,
        { reason: trimmed },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setNotification({
          open: true,
          severity: "success",
          message: "ส่งกลับให้ตรวจสอบเรียบร้อยแล้ว",
        });
        setRejectingTicketId(null);
        setRejectReason("");
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        setNotification({
          open: true,
          severity: "error",
          message: err.response?.data?.error || "ส่งกลับให้ตรวจสอบไม่สำเร็จ",
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
            {[...ticketData]
              .filter((item) => Number(item.status_id) !== 5)
              .sort((a, b) => {
                const aIsRejected = isRejectedTicket(a);
                const bIsRejected = isRejectedTicket(b);
                if (aIsRejected && !bIsRejected) return -1;
                if (!aIsRejected && bIsRejected) return 1;

                const timeA = new Date(
                  a.reassign_info?.user_rejected_at ||
                  a.reassign_info?.reassigned_at ||
                  a.completed_at ||
                  a.created_at
                ).getTime();
                const timeB = new Date(
                  b.reassign_info?.user_rejected_at ||
                  b.reassign_info?.reassigned_at ||
                  b.completed_at ||
                  b.created_at
                ).getTime();

                if (!isNaN(timeA) && !isNaN(timeB) && timeB !== timeA) {
                  return timeB - timeA;
                }
                return Number(b.ticket_id || 0) - Number(a.ticket_id || 0);
              })
              .map((item, index) => {
                const statusId = Number(item.status_id);
                const rejected = isRejectedTicket(item);

                return (
                  <TableRow
                    key={item.ticket_id || index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      ...(rejected && {
                        bgcolor: "rgba(239, 68, 68, 0.04)",
                        "&:hover": {
                          bgcolor: "rgba(239, 68, 68, 0.08) !important",
                        },
                      }),
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell component="th" scope="row">
                      <Typography fontWeight={rejected ? 600 : 500}>
                        {item.title}
                      </Typography>
                      {rejected && item.reassign_info?.user_rejection_reason && (
                        <Typography
                          variant="caption"
                          color="error.main"
                          sx={{ display: "block", mt: 0.5, fontWeight: 500 }}
                        >
                          เหตุผลที่ส่งกลับ: {item.reassign_info.user_rejection_reason}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {rejected ? (
                        <Chip
                          label="ส่งกลับตรวจสอบอีกครั้ง"
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      ) : (
                        item.status_name ?? statusMap[statusId] ?? "-"
                      )}
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
                          onClick={() => {
                            setRejectReason("");
                            setRejectingTicketId(item.ticket_id);
                          }}
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
        <DialogTitle sx={{ fontWeight: 600 }}>
          ส่งกลับเพื่อตรวจสอบปัญหาอีกครั้ง
        </DialogTitle>
        <DialogContent dividers>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            กรุณาระบุเหตุผลหรืออาการที่ยังพบ เพื่อส่งกลับตรวจสอบและดำเนินการแก้ไขเพิ่มเติม
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="เหตุผลที่ไม่ยอมรับผลการซ่อม"
            placeholder="เช่น เครื่องยังเปิดไม่ติดเหมือนเดิม, หน้าจอยังมีเส้นกระพริบ, อาการเดิมยังไม่หาย"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
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
            disabled={!rejectReason.trim()}
            sx={technicianStatusButtonSx}
          >
            ส่งกลับตรวจสอบอีกครั้ง
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
