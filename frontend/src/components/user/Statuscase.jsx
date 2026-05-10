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
  const [ticketId, setticketId] = useState();
  const [ticketDeviceId, setticketDeviceId] = useState();
  const user_id = useSelector((state) => state.user.user_id);
  const status_id = 6;
  const [ticketData, setticketData] = useState([]);
  const [reFresh, setRefresh] = useState(true);
  const navigate = useNavigate();
  console.log("deviceid", ticketDeviceId);
  console.log("ticketData: ", ticketData);
  console.log("id", ticketId);
  const topagedetail = (ticket_id) => {
    navigate(`/user/Detailticket/${ticket_id}`);
  };
  const updatestatusticket = (ticket_id, ticket_device_id) => {
    axios
      .patch(`http://localhost:5011/ticket/${user_id}/${ticket_id}`, {
        ticket_id: ticketId,
        ticket_device_id,
        user_id,
        status_id,
      })
      .then((result) => {
        console.log(result);
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5011/ticketuserstatus/${user_id}`)
      .then(function (response) {
        setticketData(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }, [reFresh]);

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
              item.status_id === 6 ? null : (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {item.title}
                  </TableCell>

                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.status_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => topagedetail(item.ticket_id)}
                    >
                      เพิ่มเติม
                    </Button>
                  </TableCell>
                  <TableCell>
                    {item.status_id === 3 ? (
                      <Button
                        onClick={() => {
                          if (window.confirm("ยืนยันการซ่อม")) {
                            updatestatusticket(
                              item.ticket_id,
                              item.ticket_device_id,
                            );
                            setticketId(item.ticket_id);
                          }
                        }}
                        variant="contained"
                        color="success"
                      >
                        ยืนยันการซ่อม
                      </Button>
                    ) : item.status_id !== 6 ? (
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
