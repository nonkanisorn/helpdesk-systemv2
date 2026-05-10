import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography } from "@mui/material";

import Button from "@mui/material/Button";
import History from "../History";
function Detailcasetechfinish() {
  const { ticket_id } = useParams();
  const [ticketdatabyID, setticketdatabyID] = useState([]);
  const [imgurl, setImgUrls] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5011/ticketid/${ticket_id}`)
      .then(function (response) {
        // console.log(response)
        setticketdatabyID(response.data);
        console.log("ticket", ticketdatabyID);
        const urls = response.data.map((ticketdata) => {
          const bufferData = new Uint8Array(ticketdata.ticket_img.data);
          const blob = new Blob([bufferData], { type: "image/jpeg" });

          return URL.createObjectURL(blob);
        });
        setImgUrls(urls);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }, [ticket_id]);
  console.log(ticketdatabyID);
  return <History />;
}

export default Detailcasetechfinish;
