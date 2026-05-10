import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  username: "",
  token: "",
  // users_id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, role_id, token, first_name, last_name, user_id, department_id } =
        action.payload;
      state.username = username;
      state.role_id = role_id;
      state.token = token;
      state.first_name = first_name;
      state.last_name = last_name;
      state.user_id = user_id;
      state.department_id = department_id;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.username = "";
      state.role_id = "";
      state.token = "";
      state.first_name = "";
      state.last_name = "";
      state.user_id = "";
      state.department_id = "";

      localStorage.removeItem("user");
      // navigate("/login");
      // window.location.reload();
    },
    loadUserFromStorage: (state, action) => {
      const userData = action.payload;
      if (userData) {
        state.username = userData.username;
        state.role_id = userData.role_id;
        state.first_name = first_name;
        state.last_name = last_name;
        state.token = userData.token;
        state.user_id = userData.user_id;
        state.department_id = userData.department_id;
      }
    },
  },
});

export const { login, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
