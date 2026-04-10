export type PackageScanRequest = {
    trackingCode: string;
    recipientName: string;
    recipientPhoneNumber: string;
    companyName?: string;
    fiscalCode?: string;
    legalAddress?: string;
    contactPerson?: string;
};

export type PackageScanResponse = {
    packageId: number;
    userId: number;
    trackingCode: string;
    userWasCreated: boolean;
    isBusiness: boolean;
    businessProfileCreated: boolean;
    activationToken?: string | null;
    activationLink?: string | null;
    message: string;
};