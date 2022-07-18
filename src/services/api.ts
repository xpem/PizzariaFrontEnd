import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { Authorization: `Bearer ${cookies["@nextauth.token"]}` },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (err: AxiosError) => {
      if (err.response?.status === 401) {
        if (typeof window !== undefined) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(err);
    }
  );

  return api;
}
