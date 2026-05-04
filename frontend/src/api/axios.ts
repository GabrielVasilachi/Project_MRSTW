import axios from "axios";
import { clearSession, getSession } from "../auth/auth.session";
import { paths } from "../routes/paths";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5242/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getSession()?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            clearSession();

            if (window.location.pathname !== paths.LoginPage) {
                window.location.assign(paths.LoginPage);
            }
        }

        if (status === 403 && window.location.pathname !== paths.Forbidden) {
            window.location.assign(paths.Forbidden);
        }

        return Promise.reject(error);
    },
);
