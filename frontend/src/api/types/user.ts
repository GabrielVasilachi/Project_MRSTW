export type UserResponse = {
    id: number;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
    roleEnum: number | string;
    isTemporary: boolean;
    isPhoneConfirmed?: boolean;
    createdAt?: string;
    hasExpiredActivationToken?: boolean;
    activationTokenExpiresAt?: string | null;
};

export type UserActivationTokenResponse = {
    userId: number;
    activationToken: string;
    activationLink: string;
    expiresAt: string;
    message: string;
};

export type UserUpdateRequest = {
    fullName: string;
    phoneNumber: string;
    email?: string | null;
};
