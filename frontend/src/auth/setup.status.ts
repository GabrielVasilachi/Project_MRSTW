// Utility for tracking individual account setup status
const SETUP_COMPLETED_KEY = 'pv.setup.completed'

export function isSetupCompleted(userId: string): boolean {
	const completed = localStorage.getItem(SETUP_COMPLETED_KEY)
	if (!completed) return false
	
	try {
		const data = JSON.parse(completed) as Record<string, boolean>
		return data[userId] ?? false
	} catch {
		return false
	}
}

export function markSetupCompleted(userId: string): void {
	const completed = localStorage.getItem(SETUP_COMPLETED_KEY)
	let data: Record<string, boolean> = {}
	
	try {
		data = JSON.parse(completed || '{}') as Record<string, boolean>
	} catch {
		data = {}
	}
	
	data[userId] = true
	localStorage.setItem(SETUP_COMPLETED_KEY, JSON.stringify(data))
}

export function resetSetupStatus(userId: string): void {
	const completed = localStorage.getItem(SETUP_COMPLETED_KEY)
	if (!completed) return
	
	try {
		const data = JSON.parse(completed) as Record<string, boolean>
		delete data[userId]
		localStorage.setItem(SETUP_COMPLETED_KEY, JSON.stringify(data))
	} catch {
		// ignore
	}
}
