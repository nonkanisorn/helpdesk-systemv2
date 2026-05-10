import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

import { Link } from "react-router-dom";

function Managedevice() {
  const [deviceData, setDevicedata] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const Deletedevice = async (dev_id) => {
    try {
      const shouldDelete = window.confirm("คุณต้องการลบอุปกรณ์นี้หรือไม่?");
      if (!shouldDelete) {
        return;
      }
      /** */
      axios
        .delete(`${apiUrl}/Device/${dev_id}`)
        .then((response) => {
          console.log(response.data);
          axios
            .get(`${apiUrl}/Device`)
            .then((response) => {
              setDevicedata(response.data);
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error("Error deeteing data: ", error``);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    axios
      .get(`${apiUrl}/Device`)
      .then(function (response) {
        setDevicedata(response.data);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }, []);

  return (
    <div>
      <h1>
        จัดการอุปกรณ์ {"\u00A0"}
        <Link to="/admin/Adddevice">
          <Button variant="contained" size="small">
            +ADD
          </Button>
        </Link>
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>อุปกรณ์</TableCell>
              <TableCell>แก้ไข / ลบ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceData.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* <TableCell component="th" scope="row">
                  {item.dev_id}
                </TableCell> */}
                <TableCell>{item.dev_id} </TableCell>

                <TableCell>{item.dev_name}</TableCell>
                <TableCell>
                  <Link
                    to={`/admin/Editdevice/${item.dev_id}/${item.dev_name}`}
                  >
                    <Button
                      variant="contained"
                      sx={{ fontSize: "12px", backgroundColor: "#FF9933" }}
                    >
                      แก้ไข
                    </Button>
                  </Link>

                  <Button
                    onClick={() => Deletedevice(item.dev_id)}
                    variant="contained"
                    sx={{
                      fontSize: "12px",
                      backgroundColor: "red",
                      marginLeft: 3,
                    }}
                  >
                    ลบ
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default Managedevice;
