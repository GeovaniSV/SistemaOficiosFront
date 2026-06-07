import axios from "axios";
const api = axios.create({
  baseURL: "http://192.168.0.72:80",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
