import { api } from "./axios";
import type { PackageScanRequest, PackageScanResponse } from "../types/package";

export async function scanPackage(data: PackageScanRequest) {
    const response = await api.post<PackageScanResponse>("/packages/scan", data);
    return response.data;
}