export type PackageScanPhysicalProfilesRequest = {
    trackingCode: string;
    fullName: string;
    phoneNumber: string;
    locationAdress: string;
};

export type PackageScanBusinessProfilesRequest = {
    trackingCode: string;
    companyName: string;
    locationAdress: string;
    phoneNumber: string;
    contactPerson?: string | null;
};

export type PackageScanPhysicalProfilesResponse = {
    trackingCode: string;
    userId: number;
    userWasCreated: boolean;
    physicalProfileCreated: boolean;
    activationToken?: string | null;
    activationLink?: string | null;
    message: string;
};

export type PackageScanBusinessProfilesResponse = {
    trackingCode: string;
    userId: number;
    userWasCreated: boolean;
    businessProfileCreated: boolean;
    activationToken?: string | null;
    activationLink?: string | null;
    message: string;
};

export type PackageResponse = {
    id: number;
    trackingCode: string;
    phoneNumber: string;
    locationAdress: string;
    fullName?: string | null;
    companyName?: string | null;
    contactPerson?: string | null;
    status: number;
    userId?: number | null;
    createdAt: string;
};
