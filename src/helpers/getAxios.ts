import axios from "axios";
import { CustomSessionType } from "../../types";

export default function getAxios(session:CustomSessionType | null) {
  const backendAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.accessToken}`
      
    },
  });
  return backendAxios
}




