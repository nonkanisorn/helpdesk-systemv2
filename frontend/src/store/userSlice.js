import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  username: "",
  token: "",
  permissions: [],
  // users_id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const {
        username,
        role_id,
        role_name,
        token,
        first_name,
        last_name,
        user_id,
        department_id,
        permissions,
      } = action.payload;
      state.username = username;
      state.role_id = role_id;
      state.role_name = role_name;
      state.token = token;
      state.first_name = first_name;
      state.last_name = last_name;
      state.user_id = user_id;
      state.department_id = department_id;
      state.permissions = Array.isArray(permissions) ? permissions : [];

      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.username = "";
      state.role_id = "";
      state.role_name = "";
      state.token = "";
      state.first_name = "";
      state.last_name = "";
      state.user_id = "";
      state.department_id = "";
      state.permissions = [];

      localStorage.removeItem("user");
      // navigate("/login");
      // window.location.reload();
    },
    loadUserFromStorage: (state, action) => {
      const userData = action.payload;
      if (userData) {
        state.username = userData.username;
        state.role_id = userData.role_id;
        state.role_name = userData.role_name;
        state.first_name = userData.first_name;
        state.last_name = userData.last_name;
        state.token = userData.token;
        state.user_id = userData.user_id;
        state.department_id = userData.department_id;
        state.permissions = Array.isArray(userData.permissions)
          ? userData.permissions
          : [];
      }
    },
  },
});

export const { login, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
