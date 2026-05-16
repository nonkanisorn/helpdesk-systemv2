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
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
function Statuscase() {
  const user_id = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [ticketData, setticketData] = useState([]);
  const [reFresh, setRefresh] = useState(true);
  const navigate = useNavigate();

  const statusMap = {
    1: "แจ้งปัญหาใหม่",
    2: "มอบหมายให้ช่าง",
    3: "กำลังทำ",
    4: "ทำเสร็จแล้วรอการยืนยัน",
    5: "เสร็จสิ้น",
    6: "รออะไหล่",
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
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
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
            {ticketData.map((item, index) =>
              item.status_id === 5 ? null : (
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
                    {item.status_name ?? statusMap[item.status_id] ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => topagedetail(item.ticket_id)}
                    >
                      เพิ่มเติม
                    </Button>
                  </TableCell>
                  <TableCell>
                    {item.status_id === 4 ? (
                      <Button
                        onClick={() => {
                          if (window.confirm("ยืนยันการซ่อม")) {
                            updatestatusticket(item.ticket_id);
                          }
                        }}
                        variant="contained"
                        color="success"
                      >
                        ยืนยันการซ่อม
                      </Button>
                    ) : item.status_id !== 5 ? (
                      <Button variant="contained" color="error">
                        ยืนยันการซ่อม
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default Statuscase;
