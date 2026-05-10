import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const login = (users_username, users_password) => {
  return axios.post(
    "http://localhost:5000/api/login",
    {
      users_username,
      users_password,
    },
    {
      withCredentials: true,
    },
  );
};

const getToken = () => {
  const token = cookies.get("token");
  return token;
};

const getUserRole = () => {
  const token = cookies.get("token");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  console.log(role);
  return role;
};

const isLoggedIn = () => {
  const token = cookies.get("token");
  if (token) {
    const payLoad = jwtDecode(token);
    const isLogin = Date.now() < payLoad.exp * 1000;
    return isLogin;
  }
  return false;
};

export const authService = { login, getToken, getUserRole, isLoggedIn };
