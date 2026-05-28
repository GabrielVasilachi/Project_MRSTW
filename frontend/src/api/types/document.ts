export type DocumentInfo = {
    id: number;
    userId: number;
    fileName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string;
};

export type DocumentInfoWithUser = DocumentInfo & {
    userFullName: string;
    userRole: string;
};
