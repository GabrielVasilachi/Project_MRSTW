export type UserRole = 'individual' | 'business' | 'admin'

export type AuthAccount = {
	role: UserRole
	user_id: string | null
	email: string
	password: string
}

export type AuthSession = {
	role: UserRole
	userId: string | null
	email: string
	loginAt: string
}

export type AuthResult = { ok: true; session: AuthSession } | { ok: false; error: string }
