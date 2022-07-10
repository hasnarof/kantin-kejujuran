import axios from "axios";
const register = (studentId, name, password) => {
  return axios
    .post(`/api/register`, {
      studentId: studentId,
      name: name,
      password: password,
    })
    .then((response) => {
      if (response.data.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
      return response.data.data;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const login = (studentId, password) => {
  return axios
    .post(`/api/login`, {
      studentId: studentId,
      password: password,
    })
    .then((response) => {
      if (response.data.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
      return response.data.data;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};
export default AuthService;
