// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../store/userSlice";
// import { useForm } from "react-hook-form";
// import { Stack } from "@mui/system";
//
// function LoginPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm();
//   const handleLogin = async (data) => {
//     console.log(data);
//     event.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5011/login", {
//         username: data.username,
//         password: data.password,
//       });
//       // ดำเนินการหลังจากเข้าสู่ระบบสำเร็จ
//
//       console.log("responsenaa", response.data.user);
//       const is_active = response.data.user.is_active;
//       if (is_active === 0) {
//         return alert("คุณไม่มีสิทธื์เข้า");
//       }
//       dispatch(
//         login({
//           // username: response.data.payload.user,
//           role_id: response.data.user.role_id,
//           token: response.data.token,
//           first_name: response.data.user.first_name,
//           last_name: response.data.user.last_name,
//           user_id: response.data.user.id,
//           department_id: response.data.user.department_id,
//         }),
//       );
//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           // username: response.data.payload.user,
//           first_name: response.data.user.first_name,
//           last_name: response.data.user.last_name,
//           role_id: response.data.user.role_id,
//           token: response.data.token,
//           user_id: response.data.user.id,
//           department_id: response.data.user.department_id,
//         }),
//       );
//       // localStorage.setItem("token", response.data.token)
//       roleRedirects(response.data.user.role_id);
//     } catch (error) {
//       // ดำเนินการเมื่อมีข้อผิดพลาดเกิดขึ้นในการเข้าสู่ระบบ
//       console.error("There was an error logging in!", error);
//       alert("Failed to login. Please check your username and password.");
//     }
//   };
//   const roleRedirects = (role) => {
//     // console.log(role)
//     if (role === 1) {
//       navigate("/admin/index");
//     } else if (role == 2) {
//       navigate("/manager/index");
//     } else if (role == 3) {
//       navigate("/technician/index");
//     } else {
//       navigate("/user");
//     }
//   };
//   // useEffect(() => {
//   //
//   //   handleLogin()
//   // }, [])
//   return (
//     <div className="login">
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           p: 1,
//           m: 1,
//           height: "100vh", // ตั้งค่าความสูงของ Box เพื่อให้ Card อยู่ตรงกลางหน้าจอ
//         }}
//       >
//         <Card sx={{ minWidth: 450, minHeight: 400, borderRadius: 4 }}>
//           <CardContent>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <img src="../../public/assets/205.jpg" height={150}></img>
//             </Box>
//
//             <Typography
//               variant="h4"
//               textAlign="center"
//               sx={{ mt: 3, fontStyle: "italic" }}
//             >
//               {/* Sing in */}
//             </Typography>
//             <Typography
//               sx={{}}
//               fontWeight="bold"
//               variant="h4"
//               marginRight={3}
//               color="text.primary"
//               textAlign={"center"}
//               gutterBottom
//             ></Typography>
//             <form onSubmit={handleSubmit(handleLogin)}>
//               <Stack spacing={2}>
//                 <TextField
//                   {...register("username")}
//                   label="Username"
//                 ></TextField>
//                 <TextField
//                   label="Password"
//                   type="password"
//                   {...register("password")}
//                   // {...register("password", {
//                   //   minLength: {
//                   //     value: 6,
//                   //     message: "Password should be at least 6 characters",
//                   //   },
//                   // })}
//                   // label="Password"
//                 ></TextField>
//                 {/* {errors.password && ( */}
//                 {/*   <Typography>{errors.password.message}</Typography> */}
//                 {/* )} */}
//               </Stack>
//               <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
//                 <Button type="submit" variant="contained" fullWidth>
//                   Login
//                 </Button>
//               </Box>
//             </form>
//           </CardContent>
//         </Card>
//       </Box>
//     </div>
//   );
// }
// export default LoginPage;
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { useForm } from "react-hook-form";

import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  Stack,
  InputAdornment,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const response = await axios.post("http://localhost:5011/login", {
        username: data.username,
        password: data.password,
      });

      const user = response.data.user;

      if (user.is_active === 0) {
        return alert("คุณไม่มีสิทธิ์เข้าใช้งาน");
      }

      const userData = {
        role_id: user.role_id,
        token: response.data.token,
        first_name: user.first_name,
        last_name: user.last_name,
        user_id: user.id,
        department_id: user.department_id,
      };

      dispatch(login(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      roleRedirects(user.role_id);
    } catch (error) {
      console.error("There was an error logging in!", error);
      alert("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบ Username และ Password");
    }
  };

  const roleRedirects = (role) => {
    if (role === 1) {
      navigate("/admin/index");
    } else if (role === 2) {
      navigate("/manager/index");
    } else if (role === 3) {
      navigate("/technician/index");
    } else {
      navigate("/user");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "linear-gradient(135deg, #eff6ff 0%, #f8fafc 45%, #ffffff 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 430,
          borderRadius: "24px",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
          border: "1px solid #eef2f7",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "18px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(37, 99, 235, 0.25)",
            }}
          >
            <HeadsetMicOutlinedIcon sx={{ color: "white", fontSize: 34 }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.6px",
            }}
          >
            Helpdesk
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#64748b",
              mt: 1,
              mb: 4,
              fontSize: "14px",
            }}
          >
            เข้าสู่ระบบเพื่อจัดการงานแจ้งซ่อม
          </Typography>

          <form onSubmit={handleSubmit(handleLogin)}>
            <Stack spacing={2.2}>
              <TextField
                fullWidth
                label="Username"
                {...register("username", {
                  required: "กรุณากรอก Username",
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password", {
                  required: "กรุณากรอก Password",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  height: 48,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "#2563eb",
                  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.25)",

                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.32)",
                  },
                }}
              >
                Login
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
