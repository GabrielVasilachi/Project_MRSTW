import { api } from "./axios";
import type {
    PackageScanBusinessProfilesRequest,
    PackageScanBusinessProfilesResponse,
    PackageScanPhysicalProfilesRequest,
    PackageScanPhysicalProfilesResponse,
    PackageResponse,
} from "./types/package";

export async function scanPhysicalProfiles(data: PackageScanPhysicalProfilesRequest) {
    const response = await api.post<PackageScanPhysicalProfilesResponse>("/packages/scan-physical-profiles", data);
    return response.data;
}

export async function scanBusinessProfiles(data: PackageScanBusinessProfilesRequest) {
    const response = await api.post<PackageScanBusinessProfilesResponse>("/packages/scan-business-profiles", data);
    return response.data;
}

export async function getPackagesByUserId(userId: number) {
    const response = await api.get<PackageResponse[]>(`/packages/by-user/${userId}`);
    return response.data;
}

export async function getAllPackages() {
    const response = await api.get<PackageResponse[]>("/packages/all");
    return response.data;
}
