import axios from "axios";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

function Editdevice() {
  const navigate = useNavigate();
  const { dev_id, dev_name } = useParams();
  const [newName, setNewDevName] = useState(dev_name);


  const apiUrl = process.env.REACT_APP_API_URL;
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("newName", newName);


    axios
      .put(`${apiUrl}/Device/${dev_id}/${newName}`, formData)
      .then(() => {
        console.log(`Updated device name to: ${newName}`);
        navigate("/admin/Managedevice");
      })
      .catch((error) => {
        console.error("Error updateing data: ", error);
      });
  };
  console.log(newName);
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper sx={{ maxWidth: 600, p: 8, borderRadius: 3, boxShadow: 3 }}>
        <Box>
          <Typography textAlign="center" variant="h3">
            แก้ไขอุปกรณ์
          </Typography>
        </Box>

        <Box mt={5}>
          <Typography>ชื่ออุปกรณ์เดิม : {dev_name} </Typography>
          <Box display="flex" mt={5}>
            <Typography>ชื่ออุปกรณ์ใหม่ :</Typography>
            <TextField
              sx={{ ml: 3 }}
              onChange={(e) => setNewDevName(e.target.value)}
            ></TextField>
          </Box>
          <Box ml={14}>
            <Button
              variant="contained"
              sx={{ mt: 5, mb: 4 }}
              onClick={handleUpdate}
              color="success"
            >
              ยืนยัน
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 5, mt: 5, mb: 4 }}
              color="error"
            >
              ยกเลิก
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
    // <div>
    //   <h1>Edit device</h1>/<p>Device ID: {dev_id}</p>
    //   <p>Device Name: {dev_name} </p>
    //   <form>
    //     <label>
    //       New Device Name:
    //       <input
    //         type="text"
    //         value={newName}
    //         onChange={(e) => setNewDevName(e.target.value)}
    //       />
    //     </label>
    //     <button type="button" onClick={handleUpdate}>
    //       Update
    //     </button>
    //   </form>
    // </div>
  );
}

export default Editdevice;
