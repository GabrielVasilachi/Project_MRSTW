export type UserCreateRequest = {
    fullName: string;
    phoneNumber: string;
    email?: string;
};

export type UserResponse = {
    id: number;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
    roleEnum: number;
    isTemporary: boolean;
};