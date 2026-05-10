import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Input,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router-dom";
import axios from "axios";
function Edituser() {
  const navigate = useNavigate();
  const { users_id } = useParams();
  const [userData, setUserData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [depName, setDepName] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newUserpassword, setNewUserpassword] = useState("");
  const [newRolename, setNewRolename] = useState("");
  const [newProfile, setNewProfile] = useState(null);
  const [newDepname, setNewDepname] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [user_phone, setUserPhone] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  formData.append("full_name", newName);
  formData.append("username", newUsername);
  formData.append("userpassword", newUserpassword);
  formData.append("role_id", newRolename);
  formData.append("department_id", newDepname);
  formData.append("user_img", newProfile);
  formData.append("email", user_email);
  formData.append("phone", user_phone);
  const handleSubmit = () => {
    axios
      .patch(`${apiUrl}/userupdate/${users_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        console.log("updatesuccess");
        setNewUsername(" ");
        setNewName(" ");
        setNewUserpassword(" ");
        setNewRolename("");
        document.getElementById("userProfile").value = null;
        setNewProfile(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // `http://localhost:5011/userbyid/${users_id}`,
          `http://localhost:5011/users/${users_id}`,
        );
        setUserData(response.data);
        console.log("userdata", userData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await axios.get(`http://localhost:5011/roles`);
        setRoleData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDepData = async () => {
      try {
        const response = await axios.get("http://localhost:5011/departments");
        setDepName(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoleData();
    fetchDepData();
  }, []);

  console.log("depname", depName);
  if (!userData || userData.length === 0) {
    return null;
  }
  console.log("userdata", userData);
  console.log("roledata", roleData);
  console.log(
    "alldata",
    newUsername,
    newUserpassword,
    newName,
    newRolename,
    newProfile,
  );
  console.log("newdep", newDepname);
  return (
    <Box>
      <Paper sx={{ pb: 3, maxHeight: "80vh", overflow: "auto" }}>
        <Typography variant="h3" textAlign="center" sx={{ mb: 3 }}>
          แก้ไข้ข้อมูลผู้ใช้
        </Typography>
        <hr />
        <Box display="flex" justifyContent="center">
          <img width="200px" height="200px" src="/assets/user.png" />
        </Box>
        <Box ml={5} mt={5}>
          <Typography>ชื่อผู้ใช้เดิม: {userData[0].username}</Typography>
          <Box mt={3}>
            <Typography component="span">ชื่อผู้ใช้ใหม่ : </Typography>
            <TextField
              onChange={(e) => setNewUsername(e.target.value)}
              value={newUsername}
            ></TextField>
          </Box>
          <br />
          <Box mt={3}>
            <Typography component="span" sx={{ mt: 3 }}>
              รหัสผ่านใหม่ :{" "}
            </Typography>
            <TextField
              onChange={(e) => setNewUserpassword(e.target.value)}
              value={newUserpassword}
            ></TextField>
          </Box>
          <br />
          <Box>
            <Typography>
              ชื่อนามสกุลผู้ใช้เดิม : {userData[0].full_name}
            </Typography>
            <Typography component="span">ชื่อนามสกุลผู้ใช้ใหม่ : </Typography>
            <TextField
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            ></TextField>
          </Box>
          <Box>
            <Typography component="span">Email: {userData[0].email}</Typography>
            <TextField
              onChange={(e) => setUserEmail(e.target.value)}
            ></TextField>
          </Box>

          <Box>
            <Typography component="span">Phone: {userData[0].phone}</Typography>
            <TextField
              onChange={(e) => setUserPhone(e.target.value)}
            ></TextField>
          </Box>
          <Box>
            <Typography>
              แผนกผู้ใช้เดิม : {userData[0].dep_name || "ยังไม่มีแผนก"}
            </Typography>
            <Box display="flex">
              <Typography>แผนกผู้ใช้ใหม่: {userData[0].dep_id}</Typography>
              <Select
                sx={{ ml: 3 }}
                onChange={(e) => setNewDepname(e.target.value)}
              >
                {depName.map((item) => (
                  <MenuItem key={item.id} value={item.dep_id}>
                    {item.dep_name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <br />
          <Box>
            <Typography>บทบาทเดิม : {userData[0].role_name}</Typography>
            <Typography component="span">บทบาทใหม่ : </Typography>
            <Select
              onChange={(e) => setNewRolename(e.target.value)}
              value={newRolename}
            >
              <MenuItem value="none">none</MenuItem>
              {roleData.map((data, idx) => (
                <MenuItem key={idx} value={data.role_id}>
                  {data.role_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <br />
          <Box>
            <Typography component="span">เปลี่ยนรูปโปรไฟล์ผู้ใช้ : </Typography>
            <Input
              id="userProfile"
              type="file"
              onChange={(e) => setNewProfile(e.target.files[0])}
            ></Input>
          </Box>
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            ยืนยัน
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3, ml: 4 }}
            onClick={() => navigate(`/admin/manageuser`)}
          >
            ยกเลิฺก
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Edituser;
