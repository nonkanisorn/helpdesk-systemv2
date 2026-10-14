import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 999,
          fontWeight: 700,
          letterSpacing: "0.01em",
          textTransform: "none",
          transition:
            "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
          "&:not(.Mui-disabled):hover": {
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          boxShadow: "0 6px 16px rgba(25, 118, 210, 0.24)",
          "&:hover": {
            background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
            boxShadow: "0 10px 22px rgba(25, 118, 210, 0.32)",
          },
        },
        outlinedPrimary: {
          borderColor: "#90caf9",
          color: "#0d47a1",
          "&:hover": {
            borderColor: "#1976d2",
            backgroundColor: "rgba(25, 118, 210, 0.06)",
            boxShadow: "0 6px 14px rgba(25, 118, 210, 0.12)",
          },
        },
        containedSuccess: {
          boxShadow: "0 6px 16px rgba(46, 125, 50, 0.22)",
        },
        containedWarning: {
          boxShadow: "0 6px 16px rgba(237, 108, 2, 0.22)",
        },
        containedError: {
          boxShadow: "0 6px 16px rgba(211, 47, 47, 0.22)",
        },
      },
    },
  },
});
