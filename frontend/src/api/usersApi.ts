import { api } from "./axios";
import type { UserResponse } from "./types/user";

export async function getUsers() {
    const response = await api.get<UserResponse[]>("/users");
    return response.data;
}
