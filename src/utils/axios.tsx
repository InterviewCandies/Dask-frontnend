import axios from "axios";
import { AUTH_TOKEN } from "../types";
const instance = axios.create({
  baseURL: "https://dask-ver1.herokuapp.com/api",
});

export default instance;
