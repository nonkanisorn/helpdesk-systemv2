import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography } from "@mui/material";

import Button from "@mui/material/Button";

function Casedetailstatus() {
  const { ticket_id } = useParams();
  const [ticketdatabyID, setticketdatabyID] = useState([]);
  const [imgurl, setImgUrls] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5011/ticketid/${ticket_id}`)
      .then(function (response) {
        setticketdatabyID(response.data);
        const urls = response.data.map((ticketdata) => {
          const bufferData = new Uint8Array(ticketdata.ticket_img.data);
          const blob = new Blob([bufferData], { type: "image/jpeg" });

          return URL.createObjectURL(blob);
        });
        setImgUrls(urls);
      })
      .catch(function (error) {})
      .finally(function () {});
  }, [ticket_id]);
  return (
    <Box>
      <Paper sx={{ height: 400, width: "100%" }}>
        {ticketdatabyID.map((data, index) => (
          <Box key={data.id}>
            <Typography align="center" variant="h3" mb={3}>
              รายละเอียดเคส
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ชื่องาน:{data.title}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              รายละเอียดงาน:{data.description}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              เวลาที่แจ้ง:
              {new Date(data.created_at).toLocaleString("th-TH", {
                dateStyle: "short",
                timeStyle: "medium",
              })}
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
              เวลาที่มอบหมายงานให้ช่าง:
              {new Date(data.assigned_at).toLocaleString("th-TH", {
                dateStyle: "short",
                timeStyle: "medium",
              })}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              วันที่ช่างทำเสร็จ:
              {data.work_completed_at === null
                ? "ยังไม่เสร็จ"
                : new Date(data.work_completed_at).toLocaleString("th-TH", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              วันที่ได้รับการยืนยันว่าซ่อมแล้ว:
              {data.closed_at === null
                ? "ยังไม่ได้รับการยืนยัน"
                : new Date(data.work_completed_at).toLocaleString("th-TH", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
    // <div>
    //   {ticketdatabyID.map((ticketdata) => (
    //     <div key={ticketdata.ticket_id}>
    //       <h1>หัวข้อ: {ticketdata.ticket_title}</h1>
    //       <img src={imgurl} alt="รุป" width={500} height={400} />
    //       <div>{ticketdata.ticket_detail}</div>
    //       <span>รายชื่อช่างที่ได้รับมอบหมาย</span> <span>{ticketdata.name}</span>
    //       <div>
    //         <Button onClick={() => navigate("/manager/statusticket")}>
    //           Back
    //         </Button>
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
}

export default Casedetailstatus;
