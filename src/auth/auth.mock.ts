import mockAuthJson from '../_mock/mock_auth.json'
import { paths } from '../routes/paths'
import type { AuthAccount, AuthResult, AuthSession, UserRole } from './auth.types'

type MockAuthFile = { accounts: AuthAccount[] }

// normalizeaza emailul sa fie lowercase si sa nu aiba spatii in plus
function normalizeEmail(inputEmail: string) {
	return inputEmail.trim().toLowerCase()
}

// emailul trebuie sa contina @ si un punct si sa nu aiba alte spatii, .test returneaza true, false daca formatul este bun
function isEmailFormatValid(inputEmail: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(inputEmail))
}

// extrage lista de conturi din fisierul mock_auth.json daca structura nu este corecta, returneaza un array gol
function getMockAccounts(): AuthAccount[] {
	const mockFile = mockAuthJson as unknown as MockAuthFile
	return Array.isArray(mockFile.accounts) ? mockFile.accounts : []
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