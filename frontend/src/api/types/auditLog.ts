export type AuditLogEntry = {
    id: string;
    timestamp: string;
    actorUserId?: number | null;
    actorName?: string | null;
    actorRole?: string | null;
    userId?: number | null;
    user: string;
    role: string;
    action: string;
    target: string;
    details: string;
    userPhoneNumber?: string | null;
    userEmail?: string | null;
    isTemporary?: boolean | null;
    isPhoneConfirmed?: boolean | null;
};
