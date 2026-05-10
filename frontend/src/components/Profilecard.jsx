import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
function Profilecard({ tech, sendtech }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log("api", apiUrl);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get();
      };
    } catch (error) {}
  });

  return (
    <Card sx={{ height: 250, width: 500 }}>
      <Box display="flex" justifyContent="space-around">
        <CardContent>
          <Typography variant="h5" color="text.secondary">
            ข้อมูลรายละเอียดช่าง
          </Typography>
          <br />
          <Typography variant="h5">{tech.name}</Typography>
          <br />
          <Typography color="text.secondary">Emailsddas</Typography>
          <Typography color="text.secondary">Phone</Typography>
        </CardContent>
        <CardMedia
          component="img"
          image="https://images.unsplash.com/photo-1719937206498-b31844530a96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
          sx={{ width: 195, borderRadius: "50%" }}
        ></CardMedia>
      </Box>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          size="medium"
          color="success"
          sx={{ ml: 2 }}
          onClick={sendtech}
        >
          {" "}
          เพิ่มช่าง
        </Button>
        <Button variant="contained" size="medium" color="info">
          {" "}
          ดูตารางงานช่าง
        </Button>
      </CardActions>
    </Card>
  );
}

export default Profilecard;
