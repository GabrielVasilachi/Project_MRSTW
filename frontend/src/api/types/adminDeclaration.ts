export type AdminDeclarationsFilter = 'all' | 'physical' | 'legal';

export type AdminDeclarationFieldReview = {
    fieldKey: string;
    isVerified?: boolean | null;
    comment?: string | null;
};

export type AdminDeclarationAuditEntry = {
    action: string;
    actorId?: number | null;
    createdAt: string;
    comment?: string | null;
};

export type AdminDeclarationReviewMetadata = {
    reviewState?: string | null;
    reviewerId?: number | null;
    reviewedAt?: string | null;
    comment?: string | null;
    fields?: AdminDeclarationFieldReview[];
    history?: AdminDeclarationAuditEntry[];
};

export type AdminDeclarationUserInfo = {
    id: number;
    fullName: string;
    email?: string | null;
    phoneNumber: string;
};

export type AdminDeclarationResponse = {
    id: number;
    declarationType: 'physical' | 'legal';
    personType: string;
    userId: number;
    packageId?: number | null;
    user: AdminDeclarationUserInfo;
    productName: string;
    productURL: string;
    trackingCode: string;
    senderName?: string | null;
    hsCode?: string | null;
    category: number;
    quantity: number;
    totalCost: number;
    currency: number;
    status: number;
    createdAt: string;
    review?: AdminDeclarationReviewMetadata | null;
};

export type AdminDeclarationActionRequest = {
    action: string;
    declarationType: 'physical' | 'legal';
    targetStatus?: number | null;
    comment?: string | null;
    fieldReviews?: AdminDeclarationFieldReview[] | null;
};
