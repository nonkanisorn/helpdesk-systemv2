import React, { useMemo } from "react";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";

const gradients = [
  "linear-gradient(135deg, #2563eb, #06b6d4)",
  "linear-gradient(135deg, #7c3aed, #ec4899)",
  "linear-gradient(135deg, #0f766e, #22c55e)",
  "linear-gradient(135deg, #ea580c, #facc15)",
  "linear-gradient(135deg, #4338ca, #38bdf8)",
  "linear-gradient(135deg, #be123c, #fb7185)",
];

export const getProfileInitials = (firstName, lastName, fallbackName) => {
  const first = String(firstName ?? "").trim();
  const last = String(lastName ?? "").trim();

  if (first && last) return `${first.charAt(0)}${last.charAt(0)}`;
  if (first) return first.slice(0, 2);

  const fallback = String(fallbackName ?? "").trim();
  if (!fallback) return "U";

  const parts = fallback.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;

  return fallback.slice(0, 2);
};

export const getProfileGradient = (value) => {
  const text = String(value || "user");
  const sum = [...text].reduce((total, char) => total + char.charCodeAt(0), 0);

  return gradients[sum % gradients.length];
};

function ProfileInitialsAvatar({ size = 48, sx }) {
  const { first_name, last_name, full_name, username, user_id } = useSelector(
    (state) => state.user,
  );

  const initials = useMemo(
    () => getProfileInitials(first_name, last_name, full_name || username),
    [first_name, last_name, full_name, username],
  );

  const background = useMemo(
    () =>
      getProfileGradient(
        `${first_name ?? ""}${last_name ?? ""}${full_name ?? ""}${user_id ?? ""}`,
      ),
    [first_name, last_name, full_name, user_id],
  );

  return (
    <Avatar
      alt="profile-user"
      sx={{
        width: size,
        height: size,
        background,
        color: "white",
        fontSize: Math.max(14, Math.round(size * 0.36)),
        fontWeight: 800,
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.18)",
        border: "2px solid rgba(255, 255, 255, 0.85)",
        ...sx,
      }}
    >
      {initials.toUpperCase()}
    </Avatar>
  );
}

export default ProfileInitialsAvatar;
