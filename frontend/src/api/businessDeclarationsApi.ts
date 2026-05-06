import { api } from "./axios";
import type { BusinessDeclarationCreateRequest, BusinessDeclarationResponse } from "./types/businessDeclaration";

export async function createBusinessDeclaration(data: BusinessDeclarationCreateRequest) {
    const response = await api.post<BusinessDeclarationResponse>("/business-declarations", data);
    return response.data;
}

export async function getBusinessDeclarationsByUserId(userId: number) {
    const response = await api.get<BusinessDeclarationResponse[]>(`/business-declarations/by-user/${userId}`);
    return response.data;
}
