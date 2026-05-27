import { api } from "./axios";
import type { AdminDeclarationActionRequest, AdminDeclarationResponse, AdminDeclarationsFilter } from "./types/adminDeclaration";

export async function getAdminDeclarations(filter: AdminDeclarationsFilter = "all") {
    const response = await api.get<AdminDeclarationResponse[]>("/admin-declarations", {
        params: { filter },
    });

    return response.data;
}

export async function openAdminDeclaration(id: number, data: AdminDeclarationActionRequest) {
    const response = await api.post(`/admin-declarations/${id}/open`, data);
    return response.data;
}
