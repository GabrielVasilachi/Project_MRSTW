export type PhysicalDeclarationCreateRequest = {
    userId: number;
    packageId?: number | null;
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
    packageId?: number | null;
    productName: string;
    productURL: string;
    trackingCode: string;
    quantity: number;
    totalCost: number;
    currency: number;
    category: number;
    status: number;
    createdAt: string;
};
