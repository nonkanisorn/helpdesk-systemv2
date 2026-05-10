import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Input } from "@mui/material";

function Testapi() {
  const users_id = 6;
  const [url, setUrl] = useState("");
  const [fileimg, setFileimg] = useState();
  console.log("file", fileimg);

  const updateimg = () => {
    const formData = new FormData();
    formData.append("user_img", fileimg);
    axios.post(`http://localhost:5011/testimg/${users_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  useEffect(() => {
    axios.get(`http://localhost:5011/user`).then((response) => {
      console.log("user", response.data);
      const array = new Uint8Array(response.data[9].user_img.data);
      const blob = new Blob([array], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setUrl(url);
    });
  }, []);
  const handlefile = (e) => {
    setFileimg(e.target.files[0]);
  };
  return (
    <div>
      <img src={url} />
      <br />
      <Input type="file" onChange={handlefile}>
        test
      </Input>
      <Button onClick={updateimg}>upimg</Button>
    </div>
  );
}

export default Testapi;
