/** Format a monetary amount in Romanian locale: 333.324,00 MDL */
export function fmt(amount: number, currency = 'MDL'): string {
    return `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

export function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
