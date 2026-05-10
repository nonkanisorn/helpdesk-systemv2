import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Editdepartment() {
  const navigate = useNavigate();
  const { dep_id, dep_name } = useParams();
  const [newName, setNewdepName] = useState(dep_name);

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("newName", newName);

    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .put(`${apiUrl}/departments/${dep_id}/${newName}`, formData)
      .then((response) => {
        console.log(`Updated device name to: ${newName}`);
        navigate("/admin/Managedepartment");
      })
      .catch((error) => {
        console.error("Error updateing data: ", error);
      });
  };
  console.log(typeof newName);
  return (
    <Paper sx={{ pb: 3 }}>
      <Typography variant="h3" textAlign="center">
        แก้ไขแผนก
      </Typography>
      <Box ml={5}>
        <Typography sx={{ mb: 3, mt: 3 }}>ชื่อแผนกเดิม : {dep_name}</Typography>
        <Typography component="span">ชื่อแผนกใหม่ : </Typography>
        <TextField
          onChange={(e) => setNewdepName(e.target.value)}
        ></TextField>{" "}
        <br />
        <Box mt={3}>
          <Button
            variant="contained"
            color="success"
            sx={{ mr: 5 }}
            onClick={handleUpdate}
          >
            ยืนยัน
          </Button>
          <Button variant="contained" color="error">
            ยกเลิก
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default Editdepartment;
