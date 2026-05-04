import { api } from "./axios";
import type { AuditLogEntry } from "./types/auditLog";

export async function getAuditLogs() {
    const response = await api.get<AuditLogEntry[]>("/audit-logs");
    return response.data;
}
