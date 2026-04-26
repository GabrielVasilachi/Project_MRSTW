import { api } from "./axios";
import type {
    PackageScanBusinessProfilesRequest,
    PackageScanBusinessProfilesResponse,
    PackageScanPhysicalProfilesRequest,
    PackageScanPhysicalProfilesResponse,
} from "./types/package";

export async function scanPhysicalProfiles(data: PackageScanPhysicalProfilesRequest) {
    const response = await api.post<PackageScanPhysicalProfilesResponse>("/packages/scan-physical-profiles", data);
    return response.data;
}

export async function scanBusinessProfiles(data: PackageScanBusinessProfilesRequest) {
    const response = await api.post<PackageScanBusinessProfilesResponse>("/packages/scan-business-profiles", data);
    return response.data;
}
