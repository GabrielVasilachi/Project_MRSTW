import { api } from "./axios";
import type { PhysicalDeclarationCreateRequest, PhysicalDeclarationResponse } from "./types/physicalDeclaration";

export async function createPhysicalDeclaration(data: PhysicalDeclarationCreateRequest) {
    const response = await api.post<PhysicalDeclarationResponse>("/physical-declarations", data);
    return response.data;
}

export async function getPhysicalDeclarationsByUserId(userId: number) {
    const response = await api.get<PhysicalDeclarationResponse[]>(`/physical-declarations/by-user/${userId}`);
    return response.data;
}
