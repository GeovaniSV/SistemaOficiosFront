import axios from "axios";
const api = axios.create({
  baseURL: "https://arcologia.mirtilo.dev.br",
  headers: {
    "Content-Type": "application/json",
  },
});
