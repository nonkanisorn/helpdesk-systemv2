//
// import { Paper, Box, Typography, Grid, Stack, Button } from "@mui/material";
// import axios from "axios";
// import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
// import Paperui from "../ui/Paperui";
// import PaperuiV2 from "../ui/PaperuiV2";
// import { amber, green, red } from "@mui/material/colors";
// import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
// import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
// import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
// import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
// import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// function Managerpages() {
//   const [ticketdata, setticketdata] = useState([]);
//   const [technicianData, setTechnicianData] = useState([]);
//   const token = useSelector((state) => state.user.token);
//
//   const apiUrl = process.env.REACT_APP_API_URL;
//   console.log(ticketdata);
//   const ticketdatalenght = () => {
//     return ticketdata.length;
//   };
//   const datafilterstatusticket5 = () => {
//     return ticketdata.filter((data) => data.status_id === 5).length;
//   };
//   const datafilterstatusticket4 = () => {
//     return ticketdata.filter((data) => data.status_id === 4).length;
//   };
//
//   const datafilterstatusticket6 = () => {
//     return ticketdata.filter((data) => data.status_id === 6).length;
//   };
//   const datafilterstatusticket3 = () => {
//     return ticketdata.filter((data) => data.status_id === 3).length;
//   };
//   const datafilterstatusticket2 = () => {
//     return ticketdata.filter((data) => data.status_id === 2).length;
//   };
//   const datafilterstatusticket1 = () => {
//     return ticketdata.filter((data) => data.status_id === 1).length;
//   };
//   const countIsOverDue = () => {
//     return ticketdata.filter((data) => data.is_overdue === 1).length;
//   };
//
//   console.log("countntaj", countIsOverDue());
//   useEffect(() => {
//     axios
//       .get(`${apiUrl}/tickets`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setticketdata(response.data.result);
//       });
//   }, []);
//   // useEffect(() => {
//   //   axios.get(`${apiUrl}/users/technician`).then((response) => {
//   //     setTechnicianData(response.data);
//   //   });
//   // }, []);
//   console.log("asd", technicianData);
//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between">
//         <Typography variant="h4" fontWeight="fontWeightBold">
//           Dashbaord ผู้จัดการ
//         </Typography>
//         <Link to={{ pathname: "/manager/reportticket" }}>
//           <Button variant="contained" sx={{ borderRadius: 3 }}>
//             <SignalCellularAltRoundedIcon sx={{ mr: 1, fontSize: 20 }} />{" "}
//             ดูรายงานเต็ม
//           </Button>
//         </Link>
//       </Stack>
//       <Typography sx={{ marginY: 2 }} color="grey">
//         ภาพรวมรายงานการซ่อมทั้งหมด
//       </Typography>
//       <Grid container spacing={4}>
//         <Grid item md={3}>
//           <PaperuiV2
//             title="งานทั้งหมด"
//             icon={
//               <ConstructionRoundedIcon
//                 sx={{ fontSize: 50, color: "#2463EB" }}
//               />
//             }
//             number={ticketdatalenght()}
//           />
//         </Grid>
//         <Grid item md={3}>
//           <PaperuiV2
//             title="เสร็จสิ้น"
//             icon={
//               <CheckCircleOutlineRoundedIcon
//                 sx={{ fontSize: 50, color: green[500] }}
//               />
//             }
//             number={datafilterstatusticket6()}
//           />
//         </Grid>
//         <Grid item md={3}>
//           <PaperuiV2
//             title="กําลังดําเนินการ"
//             icon={
//               <AccessTimeRoundedIcon sx={{ fontSize: 50, color: amber[400] }} />
//             }
//             number={datafilterstatusticket2()}
//           />
//         </Grid>
//         <Grid item md={3}>
//           <PaperuiV2
//             title="เกินกำหนด"
//             icon={
//               <ErrorOutlineRoundedIcon sx={{ fontSize: 50, color: red[400] }} />
//             }
//             number={countIsOverDue()}
//           />
//         </Grid>
//       </Grid>
//       <Paper
//         sx={{
//           borderRadius: 3,
//           p: 5,
//           mt: 5,
//           pb: 25,
//           maxHeight: 750,
//           overflowY: "auto",
//         }}
//       >
//         <Typography variant="h5" fontWeight="fontWeightBold">
//           สรุปผลงานช่างแต่ละคน
//         </Typography>
//         <Typography color="grey">
//           จำนวนงงานที่ได้รับมอบหมายและงานที่เสร็จสิ้น
//         </Typography>
//         <Grid container>
//           {technicianData.map((items, index) => (
//             <Grid item xs={12} md={12}>
//               <Paper sx={{ minHeight: 150, borderRadius: 3, mt: 3, p: 4 }}>
//                 <Typography>{items.technician_name}</Typography>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Typography color="grey">ได้รับมอบหมาย</Typography>
//                   <Typography color="grey">เสร็จสิ้น</Typography>
//                   <Typography color="grey"> เกินกำหนด</Typography>
//                 </Stack>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Typography color="black">{items.assigned_count}</Typography>
//                   <Typography color="green">{items.completed_count}</Typography>
//                   <Typography textAlign="center" color="orange">
//                     0
//                   </Typography>
//                 </Stack>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>
//     </Box>
//   );
// }
// export default Managerpages;
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PaperuiV2 from "../ui/PaperuiV2";
import { hasAnyPermission, hasPermission } from "../../auth/permissions";

function Managerpages() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = useSelector((state) => state.user);
  const token = user?.token;
  const roleName = String(user?.role_name || "").toLowerCase().trim();
  const permissions = user?.permissions ?? [];
  const isManager =
    roleName === "manager" || hasPermission(permissions, "assign_ticket");

  const [ticketData, setTicketData] = useState([]);
  const [technicianData, setTechnicianData] = useState([]);

  const summary = useMemo(() => {
    return {
      total: ticketData.length,
      completed: ticketData.filter((item) => Number(item.status_id) === 5)
        .length,
      inProgress: ticketData.filter((item) =>
        [2, 3, 4, 6].includes(Number(item.status_id)),
      ).length,
      pendingAssignment: ticketData.filter(
        (item) => Number(item.status_id) === 1,
      ).length,
    };
  }, [ticketData]);

  const fetchDashboardData = async () => {
    try {
      if (isManager) {
        const [ticketRes, techRes] = await Promise.all([
          axios.get(`${apiUrl}/tickets`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/technician/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTicketData(ticketRes.data.result ?? ticketRes.data ?? []);
        setTechnicianData(techRes.data.result ?? techRes.data ?? []);
      }
    } catch (error) {
      console.error("Error fetching manager dashboard:", error);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token, isManager]);

  if (!isManager) {
    const displayRoleName = user?.role_name || "นักศึกษาฝึกงาน";
    const fullName =
      `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
      user?.username ||
      "ผู้ใช้งาน";

    return (
      <Box sx={{ width: "100%" }}>
        <Stack spacing={3}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #eef2f7",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.5}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.12)",
                }}
              >
                <WavingHandRoundedIcon sx={{ fontSize: 32, color: "#2563eb" }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                  <Typography variant="h5" fontWeight={700} color="#111827">
                    ยินดีต้อนรับ {displayRoleName}
                  </Typography>
                  <Chip
                    label={displayRoleName}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, borderRadius: "8px" }}
                  />
                </Stack>
                <Typography
                  variant="body1"
                  sx={{ color: "#3b82f6", fontWeight: 600, mt: 0.5 }}
                >
                  สวัสดี คุณ{fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  คุณสามารถเลือกเข้าใช้งานเมนูต่าง ๆ ตามสิทธิ์ที่ได้รับมอบหมายได้จากแถบเมนูด้านซ้าย
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Quick Access Cards */}
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              เมนูการทำงานที่สามารถเข้าถึงได้
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              คลิกการ์ดด้านล่างหรือเลือกจากแถบเมนูด้านซ้ายเพื่อเริ่มต้นทำงาน
            </Typography>

            <Grid container spacing={2.5}>
              {hasPermission(permissions, "view_all_ticket") && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    component={Link}
                    to="/manager/statusticket"
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease-in-out",
                      borderColor: "#e2e8f0",
                      "&:hover": {
                        borderColor: "#2563eb",
                        boxShadow: "0 8px 24px rgba(37, 99, 235, 0.12)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "14px",
                        bgcolor: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563eb",
                      }}
                    >
                      <BuildOutlinedIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} color="#111827">
                        สถานะการซ่อม
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ดูรายการและติดตามสถานะงานแจ้งซ่อมทั้งหมดในระบบ
                      </Typography>
                    </Box>
                    <ArrowForwardRoundedIcon sx={{ color: "#94a3b8" }} />
                  </Paper>
                </Grid>
              )}

              {hasAnyPermission(permissions, ["view_devices", "manage_devices"]) && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    component={Link}
                    to="/manager/manage/device"
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease-in-out",
                      borderColor: "#e2e8f0",
                      "&:hover": {
                        borderColor: "#059669",
                        boxShadow: "0 8px 24px rgba(5, 150, 105, 0.12)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "14px",
                        bgcolor: "#ecfdf5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#059669",
                      }}
                    >
                      <DevicesOutlinedIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} color="#111827">
                        จัดการอุปกรณ์
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ดูรายการ ลงทะเบียน และแก้ไขข้อมูลเครื่องอุปกรณ์
                      </Typography>
                    </Box>
                    <ArrowForwardRoundedIcon sx={{ color: "#94a3b8" }} />
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              Dashboard ผู้จัดการ
            </Typography>

            <Typography variant="body2" color="text.secondary">
              ภาพรวมรายงานการซ่อมทั้งหมด
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="งานทั้งหมด"
                number={summary.total}
                icon={<ConstructionRoundedIcon />}
                color="#2563eb"
                background="#dbeafe"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="เสร็จสิ้น"
                number={summary.completed}
                icon={<CheckCircleOutlineRoundedIcon />}
                color="#059669"
                background="#d1fae5"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="กำลังดำเนินการ"
                number={summary.inProgress}
                icon={<AccessTimeRoundedIcon />}
                color="#ca8a04"
                background="#fef3c7"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="รอมอบหมาย"
                number={summary.pendingAssignment}
                icon={<AssignmentIndRoundedIcon />}
                color="#ea580c"
                background="#ffedd5"
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                สรุปผลงานช่างแต่ละคน
              </Typography>

              <Typography variant="body2" color="text.secondary">
                จำนวนงานที่ได้รับมอบหมายและงานที่เสร็จสิ้น
              </Typography>
            </Box>

            <Chip
              label={`${technicianData.length} ช่าง`}
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
          </Stack>

          <Stack spacing={1.5}>
            {technicianData.map((item, index) => (
              <Paper
                key={item.technician_id ?? item.user_id ?? index}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                }}
              >
                <Stack spacing={1.5}>
                  <Box>
                    <Typography fontWeight={600}>
                      {item.technician_name ?? item.full_name ?? "ไม่ระบุชื่อ"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      สรุปภาระงานของช่าง
                    </Typography>
                  </Box>

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          {item.assigned_count ?? 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ได้รับมอบหมาย
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="success.main"
                        >
                          {item.completed_count ?? 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          เสร็จสิ้น
                        </Typography>
                      </Paper>
                    </Grid>

                  </Grid>
                </Stack>
              </Paper>
            ))}

            {technicianData.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  ยังไม่มีข้อมูลสรุปผลงานช่าง
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

export default Managerpages;
