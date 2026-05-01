export type UserResponse = {
    id: number;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
    roleEnum: number | string;
    isTemporary: boolean;
    isPhoneConfirmed?: boolean;
    createdAt?: string;
};
