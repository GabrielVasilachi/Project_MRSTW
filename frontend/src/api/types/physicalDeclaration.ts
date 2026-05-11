export type PhysicalDeclarationCreateRequest = {
    userId: number;
    productName: string;
    productURL: string;
    trackingCode: string;
    quantity: number;
    totalCost: number;
    currency: number;
    category: number;
};

export type PhysicalDeclarationResponse = {
    id: number;
    userId: number;
    productName: string;
    productURL: string;
    trackingCode: string;
    quantity: number;
    totalCost: number;
    currency: number;
    category: number;
    createdAt: string;
};
