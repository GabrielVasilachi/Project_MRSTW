export type PhysicalProfileResponse = {
    id: number;
    userId: number;
    fullName: string;
    phoneNumber: string;
    locationAddress: string;
    idnp?: string | null;
    email?: string | null;
};

export type PhysicalProfileUpdateRequest = {
    password: string;
    fullName: string;
    phoneNumber: string;
    locationAddress: string;
    idnp?: string | null;
    email?: string | null;
};

export type BusinessProfileResponse = {
    id: number;
    userId: number;
    companyName: string;
    phoneNumber: string;
    idnoCode?: string | null;
    locationAdress?: string | null;
    tvaCode?: string | null;
    email?: string | null;
    contactPerson?: string | null;
    responsiblePerson?: string | null;
    eoriCode?: string | null;
};

export type BusinessProfileUpdateRequest = {
    password: string;
    companyName: string;
    phoneNumber: string;
    idnoCode?: string | null;
    locationAdress?: string | null;
    tvaCode?: string | null;
    email?: string | null;
    contactPerson?: string | null;
    responsiblePerson?: string | null;
    eoriCode?: string | null;
};
