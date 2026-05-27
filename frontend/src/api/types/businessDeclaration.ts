export type BusinessDeclarationCreateRequest = {
    userId: number;
    packageId?: number | null;
    senderName: string;
    productName: string;
    productURL: string;
    trackingCode: string;
    hsCode: string;
    quantity: number;
    totalCost: number;
    currency: number;
    category: number;
};

export type BusinessDeclarationResponse = {
    id: number;
    userId: number;
    packageId?: number | null;
    senderName: string;
    productName: string;
    productURL: string;
    trackingCode: string;
    hsCode: string;
    quantity: number;
    totalCost: number;
    currency: number;
    category: number;
    status: number;
    createdAt: string;
};
