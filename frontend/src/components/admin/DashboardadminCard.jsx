import { Box, Typography, Stack, Paper } from "@mui/material";

const DashboardadminCard = ({
  data = "data",
  title = "title",
  icon = "icon",
  color = "#2563eb",
  background = "#eff6ff",
}) => {
  return (
    <Paper
      sx={{
        minHeight: 150,
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography color="text.secondary" fontWeight={600}>
            {title}
          </Typography>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              bgcolor: background,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": {
                fontSize: 28,
              },
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Typography variant="h4" fontWeight={800}>
          {data}
        </Typography>
      </Stack>
    </Paper>
  );
};
export default DashboardadminCard;
