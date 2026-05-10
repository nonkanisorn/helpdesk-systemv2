import { Grid, Paper, Stack, Typography } from "@mui/material";
const PaperuiV2 = ({
  icon = "icon",
  colorText = " grey",
  number = "0",
  title = "title",
}) => {
  return (
    <Paper sx={{ minHeight: 120, borderRadius: 3 }}>
      <Grid container>
        <Grid item md={8} alignContent="center" sx={{ p: 5 }}>
          <Typography color={colorText}>{title}</Typography>
          <Typography>{number}</Typography>
        </Grid>
        <Grid item md={4} alignContent="center" sx={{ p: 4 }}>
          <Typography>{icon}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PaperuiV2;
