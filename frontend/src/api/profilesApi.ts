import { api } from "./axios";
import type {
    BusinessProfileResponse,
    BusinessProfileUpdateRequest,
    PhysicalProfileResponse,
    PhysicalProfileUpdateRequest,
} from "./types/profile";

export async function getPhysicalProfileByPhoneNumber(phoneNumber: string) {
    const response = await api.get<PhysicalProfileResponse>(`/physical-profiles/${encodeURIComponent(phoneNumber)}`);
    return response.data;
}

export async function updatePhysicalProfileByPhoneNumber(phoneNumber: string, data: PhysicalProfileUpdateRequest) {
    const response = await api.put<string>(`/physical-profiles/${encodeURIComponent(phoneNumber)}`, data);
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
