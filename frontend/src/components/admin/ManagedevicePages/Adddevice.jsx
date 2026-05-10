import * as React from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

import InputLabel from "@mui/material/InputLabel";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useState } from "react";

function Adddevice() {
  const navigate = useNavigate();
  const [devName, setDevname] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(devName);
  const formData = new FormData();
  formData.append("dev_name", devName);

  const createdevice = async (e, event) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        ` ${apiUrl}/Device`,
        formData,
        {
          headers: {
            "Content-Type": "application/json", // ระบุ Content-Type ไปยัง server
          },
        }
      );
      setDevname("");
      navigate("/admin/Managedevice")
      console.log(response);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
        border: 1,
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <h1>เพิ่มอุปกรณ์</h1>
      </div>
      <FormControl variant="standard">
        <div style={{ marginLeft: 15, marginBottom: 15 }}></div>
        <div style={{ marginLeft: 15, marginBottom: 15 }}>
          อุปกรณ์ :
          <TextField
            id="dev_name"
            type="text"
            value={devName}
            onChange={(e) => setDevname(e.target.value)}
            placeholder="ใส่อุปกรณ์"
            sx={{ marginLeft: 2 }}
          />
        </div>
        <Button onClick={createdevice}>เพิ่มอุปกรณ์</Button>
      </FormControl>
    </Box>
  );
}

export default Adddevice;
