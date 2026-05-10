import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';

import Button from '@mui/material/Button';
import axios from 'axios';
function Adduser() {

  const [username, setusername] = useState("")
  const [userpassword, setuserpassword] = useState("")


  const register = () => {
    axios.post("http://localhost:5011/register", { username, userpassword }).then(() => {
    }).catch((error) => {
      console.error("เพิ่มไม่สำเร็จ", error)
    })
  }




  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant='h3'>เพิ่มสมาชิก</Typography>
      <Typography>Username</Typography>
      <TextField id="outlined-basic-username" label="Outlined" variant="outlined" value={username} onChange={((e) => setusername(e.target.value))} />
      <Typography>Password</Typography>
      <TextField id="outlined-basic=password" label="Outlined" type='password' variant="outlined" value={userpassword} onChange={((e) => setuserpassword(e.target.value))} /><br />
      <Button variant='outlined' onClick={register}>เพิ่มสมาชิก</Button>
    </Box>
  )
}

export default Adduser
