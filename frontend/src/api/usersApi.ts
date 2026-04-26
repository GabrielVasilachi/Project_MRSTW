import { api } from "./axios";
import type { UserCreateRequest, UserResponse } from "./types/user";

export async function createUser(data: UserCreateRequest) {
    const response = await api.post<UserResponse>("/users", data);
    return response.data;
}
