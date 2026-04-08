/** Format a monetary amount in Romanian locale: 333.324,00 MDL */
export function fmt(amount: number, currency = 'MDL'): string {
    return `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}
