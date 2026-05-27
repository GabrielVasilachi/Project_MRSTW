export type DocumentInfo = {
    id: number;
    userId: number;
    declarationId?: number | null;
    declarationType?: string | null;
    fileName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string;
};
