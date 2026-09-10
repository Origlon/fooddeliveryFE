import axios from "axios";
 
export const server = axios.create({
  baseURL: "http://localhost:2222",
  headers: { "Content-Type": "application/json" },
});