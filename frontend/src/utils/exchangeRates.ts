export type InputCurrency = 'MDL' | 'USD' | 'EUR' | 'RON'

// data.mdl.usd = 0.0557 means 1 MDL = 0.0557 USD → 1 USD = 1/0.0557 MDL
let cache: Record<string, number> | null = null
let fetchPromise: Promise<Record<string, number>> | null = null

export async function getMDLRates(): Promise<Record<string, number>> {
    if (cache) return cache
    if (!fetchPromise) {
        fetchPromise = fetch(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/mdl.json'
        )
            .then(r => r.json())
            .then((data: { mdl: Record<string, number> }) => {
                cache = data.mdl
                return data.mdl
            })
            .catch(() => {
                fetchPromise = null
                return {} as Record<string, number>
            })
    }
    return fetchPromise
}

export function toMDL(amount: number, currency: InputCurrency, rates: Record<string, number>): number {
    if (currency === 'MDL') return amount
    const rate = rates[currency.toLowerCase()]
    if (!rate || rate === 0) return amount
    return Math.round((amount / rate) * 100) / 100
}
