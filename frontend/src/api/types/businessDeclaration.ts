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
    createdAt: string;
};
