import { Typography, Grid, Stack, Paper } from "@mui/material";
const DashboardadminCard = ({
  data = "data",
  title = "title",
  icon = "icon",
}) => {
  return (
    <>
      <Paper sx={{ minHeight: 150, p: 5 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="grey">{title}</Typography>
          <Typography>{icon}</Typography>
        </Stack>
        <Typography fontWeight="fontWeightBold">{data}</Typography>
      </Paper>
    </>
  );
};
export default DashboardadminCard;
