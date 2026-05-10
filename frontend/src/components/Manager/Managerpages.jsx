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
  Button,
  Chip,
  Divider,
} from "@mui/material";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { amber, blue, green, red } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PaperuiV2 from "../ui/PaperuiV2";

function Managerpages() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [ticketData, setTicketData] = useState([]);
  const [technicianData, setTechnicianData] = useState([]);

  const summary = useMemo(() => {
    return {
      total: ticketData.length,
      completed: ticketData.filter((item) => item.status_id === 6).length,
      inProgress: ticketData.filter((item) =>
        [2, 3, 4, 5, 7].includes(item.status_id),
      ).length,
      overdue: ticketData.filter((item) => item.is_overdue === 1).length,
    };
  }, [ticketData]);

  const fetchDashboardData = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching manager dashboard:", error);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Dashboard ผู้จัดการ
              </Typography>

              <Typography variant="body2" color="text.secondary">
                ภาพรวมรายงานการซ่อมทั้งหมด
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/manager/reportticket"
              variant="contained"
              startIcon={<SignalCellularAltRoundedIcon />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              ดูรายงานเต็ม
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="งานทั้งหมด"
                number={summary.total}
                icon={
                  <ConstructionRoundedIcon
                    sx={{ fontSize: 50, color: blue[600] }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="เสร็จสิ้น"
                number={summary.completed}
                icon={
                  <CheckCircleOutlineRoundedIcon
                    sx={{ fontSize: 50, color: green[500] }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="กำลังดำเนินการ"
                number={summary.inProgress}
                icon={
                  <AccessTimeRoundedIcon
                    sx={{ fontSize: 50, color: amber[500] }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="เกินกำหนด"
                number={summary.overdue}
                icon={
                  <ErrorOutlineRoundedIcon
                    sx={{ fontSize: 50, color: red[500] }}
                  />
                }
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
                จำนวนงานที่ได้รับมอบหมาย งานที่เสร็จสิ้น และงานเกินกำหนด
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
                    <Grid item xs={12} sm={4}>
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

                    <Grid item xs={12} sm={4}>
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

                    <Grid item xs={12} sm={4}>
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
                          color="error.main"
                        >
                          {item.overdue_count ?? 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          เกินกำหนด
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
