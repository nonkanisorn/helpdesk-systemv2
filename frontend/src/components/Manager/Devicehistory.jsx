import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import axios from "axios";
function Devicehistory() {
  const { dev_id } = useParams();
  const [deviceData, setDeviceData] = useState([]);
  console.log("devid", dev_id);
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const statusmap = {
    1: "รอดำเนินการ",
    2: "กำลังดำเนินการ",
    3: "รอยืนยันการซ่อม",
    4: "รออะไหล่",
    5: "เลยกำหนดเวลาซ่อม",
    6: "เสร็จสิ้น",
  };
  const eventmap = {
    created: "สร้างเคส",
    assigned: "มอบหมายงาน",
    technician_complete: "ช่างซ่อมเสร็จ",
    user_confirmed: "ผู้ใช้ยืนยัน",
  };
  useEffect(() => {
    const fetchdata = async () => {
      const response = await axios.get(
        `http://localhost:5011/device/history/${dev_id}`,
      );
      setDeviceData(response.data);
    };
    fetchdata();
  }, [dev_id]);
  console.log(deviceData);
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 800, overflow: "auto" }}
      >
        <h2> ประวัติการซ่อมของอุปกรณ์</h2>{" "}
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">เลขเคส</TableCell>
              <TableCell align="center">รหัสอุปกรณ์</TableCell>
              <TableCell align="center">สถานะก่อนหน้า</TableCell>
              <TableCell align="center">สถานะใหม่</TableCell>
              <TableCell align="center">ผู้ที่กระทำ</TableCell>
              <TableCell align="center">ประเภทเหตุการณ์</TableCell>
              <TableCell align="center">ผลการซ่อม</TableCell>
              <TableCell align="center">เวลาบันทึกเหตุการณ์</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceData.length > 0 ? (
              deviceData.map((item, idx) => (
                <TableRow key={idx}>
                  {item.status_to === 3 ? (
                    <>
                      <TableCell align="center">{item.ticket_id}</TableCell>
                      <TableCell align="center">
                        {item.ticket_device_id}
                      </TableCell>
                      <TableCell align="center">
                        {statusmap[item.status_from]}
                      </TableCell>
                      <TableCell align="center">
                        {statusmap[item.status_to]}
                      </TableCell>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">
                        {eventmap[item.event_type]}
                      </TableCell>
                      <TableCell align="center">
                        {item.ticket_resolution}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(item.occurred_at).toLocaleString("th-TH", {
                          dateStyle: "long",
                          timeStyle: "medium",
                        })}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center">{item.ticket_id}</TableCell>
                      <TableCell align="center">
                        {item.ticket_device_id}
                      </TableCell>
                      <TableCell align="center">
                        {statusmap[item.status_from]}
                      </TableCell>
                      <TableCell align="center">
                        {statusmap[item.status_to]}
                      </TableCell>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">
                        {eventmap[item.event_type]}
                      </TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center">
                        {new Date(item.occurred_at).toLocaleString("th-TH", {
                          dateStyle: "long",
                          timeStyle: "medium",
                        })}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <p>ไม่มีข้อมูล</p>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default Devicehistory;
