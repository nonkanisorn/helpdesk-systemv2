import React from "react";
import { Alert, Snackbar } from "@mui/material";

export const confirmSoftDelete = (label) => {
  return window.confirm(
    `ต้องการลบ${label}นี้ใช่ไหม?\n\nข้อมูลนี้จะถูกซ่อนออกจากรายการใช้งาน แต่ประวัติเดิมในระบบยังคงอยู่`,
  );
};

export const getErrorMessage = (error, fallback) => {
  const responseError = error.response?.data?.error;
  if (typeof responseError === "string" && responseError.trim()) {
    return responseError;
  }

  const responseMessage = error.response?.data?.message;
  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (error.response?.status === 409) {
    return "ไม่สามารถลบได้ เนื่องจากยังมีข้อมูลที่ใช้งานอยู่";
  }

  return fallback;
};

export const useAdminFeedback = () => {
  const [feedback, setFeedback] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showFeedback = (severity, message) => {
    setFeedback({
      open: true,
      severity,
      message,
    });
  };

  const closeFeedback = () => {
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  const FeedbackSnackbar = () => (
    <Snackbar
      open={feedback.open}
      autoHideDuration={5000}
      onClose={closeFeedback}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={feedback.severity}
        variant="filled"
        onClose={closeFeedback}
        sx={{ width: "100%" }}
      >
        {feedback.message}
      </Alert>
    </Snackbar>
  );

  return { showFeedback, FeedbackSnackbar };
};
