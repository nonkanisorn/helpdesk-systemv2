import {
  Typography,
  Paper,
  Button,
  Stack,
  Box,
} from "@mui/material";

const AdminQuickActionCard = ({
  icon = "icon",
  title = "title",
  subtitle = "subtitle",
  func = "func",
  color = "#2563eb",
  background = "#eff6ff",
}) => {
  return (
    <Paper
      sx={{
        minHeight: 180,
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            bgcolor: background,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& svg": {
              fontSize: 32,
            },
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography fontWeight={800}>{title}</Typography>
          <Typography color="text.secondary" variant="body2">
            {subtitle}
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            width: "100%",
            mt: 1,
            bgcolor: color,
            boxShadow: "none",
            "&:hover": {
              bgcolor: color,
              filter: "brightness(0.92)",
              boxShadow: "none",
            },
          }}
          onClick={() => {
            func();
          }}
        >
          เพิ่ม
        </Button>
      </Stack>
    </Paper>
  );
};

export default AdminQuickActionCard;
