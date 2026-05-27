import { api } from "./axios";
import type { DocumentInfo } from "./types/document";

export async function getDocumentsByUserId(userId: number) {
    const response = await api.get<DocumentInfo[]>(`/documents/by-user/${userId}`);
    return response.data;
}

export async function uploadDocument(userId: number, declarationId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(userId));
    formData.append("declarationId", String(declarationId));

    const response = await api.post<DocumentInfo>("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function deleteDocument(documentId: number, userId: number) {
    const response = await api.delete<string>(`/documents/${documentId}?userId=${userId}`);
    return response.data;
}

export async function downloadDocumentFile(documentId: number) {
    const response = await api.get<Blob>(`/documents/${documentId}/file`, {
        responseType: "blob",
    });

    return response.data;
}

export function getDocumentFileUrl(documentId: number) {
    return `${api.defaults.baseURL}/documents/${documentId}/file`;
}
