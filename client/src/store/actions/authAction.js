import * as Types from "./types";
import Axios from "axios";
import jwtDecode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";

export const register = (user, history) => (dispatch) => {
  Axios.post("/api/users/register", user)
    .then((res) => {
      dispatch({
        type: Types.USER_ERROR,
        payload: {
          error: {},
        },
      });
      console.log(res);
      history.push("/login");
    })
    .catch((error) => {
      dispatch({
        type: Types.USER_ERROR,
        payload: {
          error: error.response.data,
        },
      });
    });
};

export const login = (user, history) => (dispatch) => {
  Axios.post("/api/users/login", user)
    .then((res) => {
      let token = res.data.token;
      localStorage.setItem("auth_token", token);
      let decode = jwtDecode(token);
      setAuthToken(token);
      dispatch({
        type: Types.SET_USER,
        payload: {
          user: decode,
        },
      });
      history.push("/");
    })
    .catch((error) => {
      dispatch({
        type: Types.USER_ERROR,
        payload: {
          error: error.response.data,
        },
      });
    });
};

export const logout = (history) => (dispatch) => {
  localStorage.removeItem("auth_token");
  history.push("/login");
  return {
    type: Types.SET_USER,
    payload: {
      user: {},
    },
  };
};
