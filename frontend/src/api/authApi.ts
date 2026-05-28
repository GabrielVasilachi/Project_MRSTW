import { api } from "./axios";
import type { AuthChangePasswordRequest, AuthLoginRequest, AuthLoginResponse, AuthSetPasswordRequest } from "./types/auth";

export async function login(data: AuthLoginRequest) {
    const response = await api.post<AuthLoginResponse>("/auth/login", data);
    return response.data;
}

export async function setPassword(data: AuthSetPasswordRequest) {
    const response = await api.post<string>("/auth/set-password", data);
    return response.data;
}

export async function changePassword(data: AuthChangePasswordRequest) {
    const response = await api.post<string>("/auth/change-password", data);
    return response.data;
}
