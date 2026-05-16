import { Box, Paper, Stack, Typography } from "@mui/material";

const PaperuiV2 = ({
  icon = "icon",
  colorText = "text.secondary",
  number = "0",
  title = "title",
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
          <Typography color={colorText} fontWeight={600}>
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
          {number}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default PaperuiV2;
