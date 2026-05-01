import { api } from "./axios";
import type { AdminProfileCreateRequest, AdminProfileResponse } from "./types/adminProfile";

export async function createAdminProfile(data: AdminProfileCreateRequest) {
    const response = await api.post<AdminProfileResponse>("/admin-profiles", data);
    return response.data;
}
