import * as React from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";

import { useState } from "react";

function Addrole() {
  const navigate = useNavigate();
  const [roleName, setrolename] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(roleName);
  const formData = new FormData();
  formData.append("role_name", roleName);

  const createrole = async (e, event) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/roles`, formData, {
        headers: {
          "Content-Type": "application/json", // ระบุ Content-Type ไปยัง server
        },
      });
      setrolename("");
      navigate("/admin/Managerole");
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
        <h1>เพิ่มตำแหน่ง</h1>
      </div>
      <FormControl variant="standard">
        <div style={{ marginLeft: 15, marginBottom: 15 }}></div>
        <div style={{ marginLeft: 15, marginBottom: 15 }}>
          ตำแหน่ง :
          <TextField
            id="dev_name"
            type="text"
            value={roleName}
            onChange={(e) => setrolename(e.target.value)}
            placeholder="ใส่อุปกรณ์"
            sx={{ marginLeft: 2 }}
          />
        </div>
        <Button onClick={createrole}>เพิ่มตำแหน่ง</Button>
      </FormControl>
    </Box>
  );
}

export default Addrole;
