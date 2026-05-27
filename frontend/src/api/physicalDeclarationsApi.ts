import { api } from "./axios";
import type { AdminDeclarationResponse } from "./types/adminDeclaration";
import type { PhysicalDeclarationCreateRequest, PhysicalDeclarationResponse, PhysicalDeclarationUpdateRequest } from "./types/physicalDeclaration";

export async function getAllPhysicalDeclarations() {
    const response = await api.get<AdminDeclarationResponse[]>("/physical-declarations");
    return response.data;
}

export async function createPhysicalDeclaration(data: PhysicalDeclarationCreateRequest) {
    const response = await api.post<PhysicalDeclarationResponse>("/physical-declarations", data);
    return response.data;
}

export async function updatePhysicalDeclaration(id: number, data: PhysicalDeclarationUpdateRequest) {
    const response = await api.put<PhysicalDeclarationResponse>(`/physical-declarations/${id}`, data);
    return response.data;
}

export async function deletePhysicalDeclaration(id: number) {
    const response = await api.delete<string>(`/physical-declarations/${id}`);
    return response.data;
}

export async function getPhysicalDeclarationsByUserId(userId: number) {
    const response = await api.get<PhysicalDeclarationResponse[]>(`/physical-declarations/by-user/${userId}`);
    return response.data;
}
