const baseButtonSx = {
  minHeight: 40,
  borderRadius: 99,
  fontWeight: 700,
  letterSpacing: "0.01em",
  textTransform: "none",
  transition: "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
  "&.Mui-disabled": {
    boxShadow: "none",
  },
};

export const technicianPrimaryButtonSx = {
  ...baseButtonSx,
  px: 2.25,
  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.24)",
  "&:hover": {
    ...baseButtonSx["&:hover"],
    background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
    boxShadow: "0 10px 22px rgba(25, 118, 210, 0.32)",
  },
};

export const technicianSecondaryButtonSx = {
  ...baseButtonSx,
  px: 2,
  borderColor: "primary.light",
  color: "primary.dark",
  "&:hover": {
    ...baseButtonSx["&:hover"],
    borderColor: "primary.main",
    backgroundColor: "rgba(25, 118, 210, 0.06)",
    boxShadow: "0 6px 14px rgba(25, 118, 210, 0.12)",
  },
};

export const technicianNeutralButtonSx = {
  ...baseButtonSx,
  px: 2,
  color: "text.secondary",
  "&:hover": {
    ...baseButtonSx["&:hover"],
    backgroundColor: "action.hover",
  },
};

export const technicianStatusButtonSx = {
  ...baseButtonSx,
  px: 2,
  "&:hover": {
    ...baseButtonSx["&:hover"],
    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.1)",
  },
};
