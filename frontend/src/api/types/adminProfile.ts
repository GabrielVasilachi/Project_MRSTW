export type AdminProfileCreateRequest = {
    phoneNumber: string;
    password: string;
};

export type AdminProfileResponse = {
    id: number;
    userId: number;
    phoneNumber: string;
    roleEnum: number | string;
};
