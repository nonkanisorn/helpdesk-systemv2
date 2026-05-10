import { Box, Paper, Typography } from "@mui/material";
const Paperui = ({ title, data }) => {
  return (
    <>
      <Paper
        elevation={2}
        sx={{
          width: "300px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3">{data}</Typography>
        </Box>
      </Paper>
    </>
  );
};

export default Paperui;
