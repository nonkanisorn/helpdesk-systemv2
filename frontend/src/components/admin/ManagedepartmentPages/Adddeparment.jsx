import * as React from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";

import axios from "axios";

import { useState } from "react";

function Adddepartment() {
  const navigate = useNavigate();
  const [departmentName, setDepartmentname] = useState("");
  console.log(departmentName);
  const apiUrl = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  formData.append("dep_name", departmentName);

  const createdepartment = async (e, event) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/departments`, formData, {
        headers: {
          "Content-Type": "application/json", // ระบุ Content-Type ไปยัง server
        },
      });
      setDepartmentname("");
      navigate("/admin/Managedepartment");
      console.log(response);
    } catch (error) {
      console.log(error);
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
        <h1>เพิ่มแผนก</h1>
      </div>
      <FormControl variant="standard">
        <div style={{ marginLeft: 15, marginBottom: 15 }}></div>
        <div style={{ marginLeft: 15, marginBottom: 15 }}>
          แผนก :
          <TextField
            id="dev_name"
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentname(e.target.value)}
            placeholder="ใส่แผนก"
            sx={{ marginLeft: 2 }}
          />
        </div>
        <Button onClick={createdepartment}>เพิ่มตำแหน่ง</Button>
      </FormControl>
    </Box>
  );
}

export default Adddepartment;
