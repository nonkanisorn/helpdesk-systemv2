import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import {
  InputLabel,
  Select,
  Typography,
  MenuItem,
  Input,
  Paper,
} from "@mui/material";

import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect } from "react";
function Adduser() {
  const [username, setusername] = useState("");
  const [userpassword, setuserpassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState([]);
  const [selectRole, setSelectRole] = useState("");
  const [fileimg, setFileimg] = useState(null);
  const [selectDepName, setSelectDepName] = useState([]);
  const [depName, setDepName] = useState([]);
  const [useremail, setUserEmail] = useState();
  const [userphone, setUserPhone] = useState();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const register = () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("userpassword", userpassword);
    formData.append("role_id", selectRole);
    formData.append("full_name", name);
    formData.append("email", useremail);
    formData.append("phone", userphone);
    formData.append("user_img", fileimg);
    formData.append("department_id", selectDepName);
    axios
      .post(`${apiUrl}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("เพิ่มสมาชิกสำเร็จ");
        console.log(response);
        navigate("/admin/manageuser ");
      })
      .catch((error) => {
        console.error("เพิ่มไม่สำเร็จ", error);
      });
  };
  const handlechangerole = (event) => {
    setSelectRole(event.target.value);
  };
  const handlechangename = (event) => {
    setName(event.target.value);
  };
  const handleSelectDepName = (event) => {
    setSelectDepName(event.target.value);
  };
  const handlefile = (e) => {
    console.log(e.target.files[0]);
    setFileimg(e.target.files[0]);
  };
  console.log(selectRole);
  useEffect(() => {
    axios.get(`${apiUrl}/roles`).then((res) => {
      setRole(res.data);
      console.log(res.data);
    });
    axios.get(`${apiUrl}/departments`).then((res) => {
      setDepName(res.data);
    });
  }, []);
  console.log(userphone);
  return (
    <Paper sx={{ pb: 3 }}>
      <Button
        variant="contained"
        color="success"
        onClick={register}
        sx={{ mt: 5 }}
      >
        เพิ่มสมาชิก
      </Button>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { ml: 5 },
          height: "50vh",
          overflow: "auto",
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h3" textAlign="center">
          เพิ่มสมาชิก
        </Typography>
        <Typography>ชื่อผู้ใช้</Typography>
        <TextField
          id="outlined-basic-username"
          variant="outlined"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <Typography sx={{ mt: 5 }}>รหัสผ่าน</Typography>
        <TextField
          id="outlined-basic=password"
          type="password"
          variant="outlined"
          value={userpassword}
          onChange={(e) => setuserpassword(e.target.value)}
        />
        <br />
        <Typography sx={{ mt: 5 }}>ชื่อ/นามสกุล</Typography>
        <TextField value={name} onChange={handlechangename} />
        <Typography sx={{ mt: 5 }}>Email</Typography>
        <TextField onChange={(e) => setUserEmail(e.target.value)}></TextField>
        <Typography sx={{ mt: 5 }}>Phone</Typography>
        <TextField onChange={(e) => setUserPhone(e.target.value)}></TextField>
        <Typography sx={{ mt: 5 }}>แผนก</Typography>
        <Select value={selectDepName} onChange={handleSelectDepName}>
          {depName.map((item, idx) => (
            <MenuItem key={item.id} value={item.dep_id}>
              {item.dep_name}
            </MenuItem>
          ))}
        </Select>
        <Typography sx={{ mt: 5 }}>บทบาท</Typography>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="role"
          value={selectRole}
          onChange={handlechangerole}
        >
          {role.map((role) => (
            <MenuItem key={role.id} value={role.role_id}>
              {role.role_name}
            </MenuItem>
          ))}
        </Select>
        <br />
        <Typography sx={{ mt: 5 }}>รุปผู้ใช้</Typography>
        <Input type="file" onChange={handlefile}></Input>
        <br />
        <Button
          variant="contained"
          color="success"
          onClick={register}
          sx={{ mt: 5 }}
        >
          เพิ่มสมาชิก
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={register}
          sx={{ mt: 5 }}
        >
          ยกเลิก
        </Button>
        <Button>test</Button>
      </Box>
    </Paper>
  );
}

export default Adduser;
