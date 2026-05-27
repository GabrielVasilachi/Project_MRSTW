import { api } from "./axios";
import type { AdminDeclarationResponse } from "./types/adminDeclaration";
import type { BusinessDeclarationCreateRequest, BusinessDeclarationResponse, BusinessDeclarationUpdateRequest } from "./types/businessDeclaration";

export async function getAllBusinessDeclarations() {
    const response = await api.get<AdminDeclarationResponse[]>("/business-declarations");
    return response.data;
}

export async function createBusinessDeclaration(data: BusinessDeclarationCreateRequest) {
    const response = await api.post<BusinessDeclarationResponse>("/business-declarations", data);
    return response.data;
}

export async function updateBusinessDeclaration(id: number, data: BusinessDeclarationUpdateRequest) {
    const response = await api.put<BusinessDeclarationResponse>(`/business-declarations/${id}`, data);
    return response.data;
}

export async function deleteBusinessDeclaration(id: number) {
    const response = await api.delete<string>(`/business-declarations/${id}`);
    return response.data;
}

export async function getBusinessDeclarationsByUserId(userId: number) {
    const response = await api.get<BusinessDeclarationResponse[]>(`/business-declarations/by-user/${userId}`);
    return response.data;
}
