import { api } from "./axios";
import type { UserActivationTokenResponse, UserResponse, UserUpdateRequest } from "./types/user";

export async function getUsers() {
    const response = await api.get<UserResponse[]>("/users");
    return response.data;
}

export async function updateUser(userId: number, data: UserUpdateRequest) {
    const response = await api.put<string>(`/users/${userId}`, data);
    return response.data;
}

export async function deleteUser(userId: number) {
    const response = await api.delete<string>(`/users/${userId}`);
    return response.data;
}

export async function regenerateActivationToken(userId: number) {
    const response = await api.post<UserActivationTokenResponse>(`/users/${userId}/activation-token/regenerate`);
    return response.data;
}
