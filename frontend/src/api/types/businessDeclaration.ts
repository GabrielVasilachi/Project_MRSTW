export type BusinessDeclarationCreateRequest = {
    userId: number;
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
    senderName: string;
    productName: string;
    productURL: string;
    trackingCode: string;
    hsCode: string;
    quantity: number;
    totalCost: number;
    currency: number;
    category: number;
    createdAt: string;
};
