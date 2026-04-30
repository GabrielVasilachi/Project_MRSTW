export type AuthLoginRequest = {
    phoneNumber: string;
    password: string;
};

export type AuthSetPasswordRequest = {
    token: string;
    password: string;
};

export type AuthLoginResponse = {
    id: number;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
    roleEnum: number | string;
    isTemporary: boolean;
    isPhoneConfirmed: boolean;
    token: string;
    message: string;
};
