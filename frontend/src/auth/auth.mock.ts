import mockAuthJson from '../_mock/mock_auth.json'
import { paths } from '../routes/paths'
import type { AuthAccount, AuthResult, AuthSession, UserRole } from './auth.types'

type MockAuthFile = { accounts: AuthAccount[] }

type CreateAccountResult = { ok: true } | { ok: false; error: string }

const LOCAL_ACCOUNTS_KEY = 'pv.accounts'

type RawAccount = {
	role?: unknown
	user_id?: unknown
	packageID?: unknown
	email?: unknown
	password?: unknown
	phoneNumber?: unknown
}

function mapRawAccount(value: unknown): AuthAccount | null {
	if (!value || typeof value !== 'object') return null

	const raw = value as RawAccount
	const role = raw.role

	if (role !== 'admin' && role !== 'business' && role !== 'individual') {
		return null
	}

	const email = String(raw.email ?? '').trim()
	const password = String(raw.password ?? raw.phoneNumber ?? '')

	if (email.length === 0 || password.length === 0) {
		return null
	}

	const rawUserId = raw.user_id ?? raw.packageID ?? null
	const user_id = rawUserId === null ? null : String(rawUserId)

	return {
		role,
		user_id,
		email,
		password,
	}
}

// normalizeaza emailul sa fie lowercase si sa nu aiba spatii in plus
function normalizeEmail(inputEmail: string) {
	return inputEmail.trim().toLowerCase()
}

// emailul trebuie sa contina @ si un punct si sa nu aiba alte spatii, .test returneaza true, false daca formatul este bun
function isEmailFormatValid(inputEmail: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(inputEmail))
}

function readLocalAccounts(): AuthAccount[] {
	const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY)
	if (!raw) return []

	try {
		const parsed = JSON.parse(raw) as unknown
		if (!Array.isArray(parsed)) return []

		return parsed.map(mapRawAccount).filter((a): a is AuthAccount => a !== null)
	} catch {
		return []
	}
}

function writeLocalAccounts(accounts: AuthAccount[]) {
	localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts))
}

// extrage lista de conturi din fisierul mock_auth.json daca structura nu este corecta, returneaza un array gol
function getMockAccounts(): AuthAccount[] {
	const mockFile = mockAuthJson as unknown as MockAuthFile
	const fileAccounts = Array.isArray(mockFile.accounts) ? mockFile.accounts : []
	const localAccounts = readLocalAccounts()
	return [...fileAccounts, ...localAccounts]
}

export function createUserAccount(input: {
	role: UserRole
	email: string
	phoneNumber: string
	packageID?: string | null
}): CreateAccountResult {
	const normalizedEmail = normalizeEmail(input.email)
	const trimmedPhoneNumber = input.phoneNumber.trim()
	const normalizedPackageId = input.packageID?.trim() ? input.packageID.trim() : null

	if (!isEmailFormatValid(normalizedEmail)) {
		return { ok: false, error: 'Email Invalid' }
	}

	if (trimmedPhoneNumber.length === 0) {
		return { ok: false, error: 'Număr de telefon Invalid' }
	}

	const existing = getMockAccounts().some((a) => normalizeEmail(a.email) === normalizedEmail)
	if (existing) {
		return { ok: false, error: 'Există deja un cont cu acest email' }
	}

	const newAccount: AuthAccount = {
		role: input.role,
		user_id: normalizedPackageId,
		email: normalizedEmail,
		password: trimmedPhoneNumber,
	}

	const nextAccounts = [...readLocalAccounts(), newAccount]
	writeLocalAccounts(nextAccounts)
	return { ok: true }
}

// functie pentru returnarea path-ului corect pentru roluri de admin business si individual
export function getDashboardPathByRole(role: UserRole) {
	switch (role) {
		case 'admin':
			return paths.Dashboard_Admin
		case 'business':
			return paths.Dashboard_Business
		case 'individual':
			return paths.Dashboard_Individual
	}
}

// primeste email si parola introduse de utilizator, valideaza datele si daca sunt corecte returneaza, daca nu, returneaza eroare
export async function loginMock(inputEmail: string, inputPassword: string): Promise<AuthResult> {
	const normalizedEmail = normalizeEmail(inputEmail)
	const trimmedPassword = inputPassword.trim()

	// verifica daca emailul are format corect
	if (!isEmailFormatValid(normalizedEmail)) {
		return { ok: false, error: 'Email Invalid' }
	}

	// verifica daca parola nu este goala
	if (trimmedPassword.length === 0) {
		return { ok: false, error: 'Parola Invalida' }
	}

	// cauta in lista de conturi 
	const matchedAccount = getMockAccounts().find(
		(account) => normalizeEmail(account.email) === normalizedEmail && account.password === inputPassword,
	)

	if (!matchedAccount) {
		return { ok: false, error: 'Email sau Parola Invalida' }
	}

	// daca autentificarea este corecta, se creeaza o sesiune noua
	const newSession: AuthSession = {
		role: matchedAccount.role,
		userId: matchedAccount.user_id,
		email: normalizedEmail,
		loginAt: new Date().toISOString(),
	}

	return { ok: true, session: newSession }
}