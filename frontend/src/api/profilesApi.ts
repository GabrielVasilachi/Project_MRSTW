import { api } from "./axios";
import type {
    BusinessProfileResponse,
    BusinessProfileUpdateRequest,
    PhysicalProfileResponse,
    PhysicalProfileUpdateRequest,
} from "./types/profile";

export async function getPhysicalProfileByUserId(userId: number) {
    const response = await api.get<PhysicalProfileResponse>(`/physical-profiles/${userId}`);
    return response.data;
}

export async function updatePhysicalProfile(userId: number, data: PhysicalProfileUpdateRequest) {
    const response = await api.put<string>(`/physical-profiles/${userId}`, data);
    return response.data;
}

export async function getBusinessProfileByUserId(userId: number) {
    const response = await api.get<BusinessProfileResponse>(`/business-profiles/${userId}`);
    return response.data;
}

export async function updateBusinessProfile(userId: number, data: BusinessProfileUpdateRequest) {
    const response = await api.put<string>(`/business-profiles/${userId}`, data);
    return response.data;
}
