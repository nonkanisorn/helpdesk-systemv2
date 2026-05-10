import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography, Grid, Chip } from "@mui/material";

import Button from "@mui/material/Button";

function History() {
  const { ticket_id } = useParams();
  const [ticketdatabyID, setticketdatabyID] = useState([]);
  const [imgurl, setImgUrls] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5011/ticketid/${ticket_id}`)
      .then(function (response) {
        // console.log(response)
        setticketdatabyID(response.data);
        console.log("ticket", ticketdatabyID);
        const urls = response.data.map((ticketdata) => {
          const bufferData = new Uint8Array(ticketdata.ticket_img.data);
          const blob = new Blob([bufferData], { type: "image/jpeg" });

          return URL.createObjectURL(blob);
        });
        setImgUrls(urls);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }, [ticket_id]);
  console.log(ticketdatabyID);
  console.log("ddd");
  return (
    <Box sx={{ p: 3 }}>
      {ticketdatabyID.map((data, index) => (
        <Paper
          key={data.id}
          sx={{
            p: 5,
            maxWidth: 900,
            mx: "auto",
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          {/* หัวเรื่อง */}
          <Typography variant="h4" align="center" gutterBottom>
            รายละเอียดเคส
          </Typography>

          <Grid container spacing={3} mt={2}>
            {/* ชื่องาน */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                ชื่องาน
              </Typography>
              <Typography variant="body1">{data.ticket_title}</Typography>
            </Grid>

            {/* รายละเอียดงาน */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                รายละเอียดงาน
              </Typography>
              <Typography variant="body1">{data.ticket_detail}</Typography>
            </Grid>

            {/* เวลาแจ้ง */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                เวลาแจ้ง
              </Typography>
              <Typography variant="body1">
                {new Date(data.created_at).toLocaleString("th-TH", {
                  dateStyle: "short",
                  timeStyle: "medium",
                })}
              </Typography>
            </Grid>

            {/* เวลามอบหมาย */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                เวลาที่มอบหมายงาน
              </Typography>
              <Typography variant="body1">
                {new Date(data.assigned_at).toLocaleString("th-TH", {
                  dateStyle: "short",
                  timeStyle: "medium",
                })}
              </Typography>
            </Grid>

            {/* วันที่เสร็จ */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                วันที่ช่างทำเสร็จ
              </Typography>
              {data.work_completed_at ? (
                <Chip
                  label={new Date(data.work_completed_at).toLocaleString(
                    "th-TH",
                    {
                      dateStyle: "short",
                      timeStyle: "medium",
                    },
                  )}
                  color="success"
                />
              ) : (
                <Chip label="ยังไม่เสร็จ" color="warning" />
              )}
            </Grid>

            {/* การยืนยัน */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                การยืนยันการซ่อม
              </Typography>
              {data.closed_at ? (
                <Chip
                  label={new Date(data.closed_at).toLocaleString("th-TH", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
                  color="success"
                />
              ) : (
                <Chip label="ยังไม่ได้รับการยืนยัน" color="error" />
              )}
            </Grid>
          </Grid>

          {/* แสดงรูปถ้ามี */}
          {imgurl.length > 0 && (
            <Box mt={4} textAlign="center">
              <Typography variant="subtitle2" gutterBottom>
                รูปภาพประกอบ
              </Typography>
              {imgurl.map((url, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={url}
                  alt={`ticket-img-${idx}`}
                  sx={{
                    maxWidth: "100%",
                    borderRadius: 2,
                    boxShadow: 2,
                    mb: 2,
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>
      ))}
    </Box>
    // <Box>
    //   <Paper sx={{ height: 500, width: "100%" }}>
    //     {ticketdatabyID.map((data, index) => (
    //       <Box key={data.id}>
    //         <Typography align="center" variant="h3" mb={3}>
    //           รายละเอียดเคส
    //         </Typography>
    //         <Box ml={3}>
    //           <Typography variant="h6" sx={{ mb: 2 }}>
    //             ชื่องาน:{data.ticket_title}
    //           </Typography>
    //           <Typography variant="h6" sx={{ mb: 2 }}>
    //             รายละเอียดงาน:{data.ticket_detail}
    //           </Typography>
    //           <Typography variant="h6" sx={{ mb: 2 }}>
    //             เวลาที่แจ้ง:
    //             {new Date(data.created_at).toLocaleString("th-TH", {
    //               dateStyle: "short",
    //               timeStyle: "medium",
    //             })}
    //           </Typography>
    //
    //           <Typography variant="h6" sx={{ mb: 2 }}>
    //             เวลาที่มอบหมายงานให้ช่าง:
    //             {new Date(data.assigned_at).toLocaleString("th-TH", {
    //               dateStyle: "short",
    //               timeStyle: "medium",
    //             })}
    //           </Typography>
    //           <Typography variant="h6" sx={{ mb: 2 }}>
    //             วันที่ช่างทำเสร็จ:
    //             {data.completed_date === null
    //               ? "ยังไม่เสร็จ"
    //               : new Date(data.work_completed_at).toLocaleString("th-TH", {
    //                 dateStyle: "short",
    //                 timeStyle: "medium",
    //               })}
    //           </Typography>
    //           <Typography variant="h6" sx={{ mb: 2 }}>
    //             วันที่ได้รับการยืนยันว่าซ่อมแล้ว:
    //             {data.closed_at === null
    //               ? "ยังไม่ได้รับการยืนยัน"
    //               : new Date(data.closed_at).toLocaleString("th-TH", {
    //                 dateStyle: "short",
    //                 timeStyle: "medium",
    //               })}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     ))}
    //   </Paper>
    // </Box>
  );
}

export default History;
