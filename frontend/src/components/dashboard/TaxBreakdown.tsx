import { fmt } from '../../utils/format'

export type ProductCategory = {
    value: number
    label: string
    vatRate: number        // e.g. 0.20
    customsRate: number    // e.g. 0.10
    exciseRate: number     // e.g. 0
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
    { value: 0,  label: 'Telefon mobil',            vatRate: 0.20, customsRate: 0.00, exciseRate: 0 },
    { value: 1,  label: 'Laptop / Notebook',         vatRate: 0.20, customsRate: 0.00, exciseRate: 0 },
    { value: 2,  label: 'Tabletă',                   vatRate: 0.20, customsRate: 0.00, exciseRate: 0 },
    { value: 3,  label: 'Electrocasnice mici',       vatRate: 0.20, customsRate: 0.07, exciseRate: 0 },
    { value: 4,  label: 'Îmbrăcăminte / Haine',     vatRate: 0.20, customsRate: 0.10, exciseRate: 0 },
    { value: 5,  label: 'Încălțăminte',              vatRate: 0.20, customsRate: 0.15, exciseRate: 0 },
    { value: 6,  label: 'Mobilă',                    vatRate: 0.20, customsRate: 0.12, exciseRate: 0 },
    { value: 7,  label: 'Piese auto',                vatRate: 0.20, customsRate: 0.10, exciseRate: 0 },
    { value: 8,  label: 'Jucării',                   vatRate: 0.20, customsRate: 0.10, exciseRate: 0 },
    { value: 9,  label: 'Cosmetice',                 vatRate: 0.20, customsRate: 0.06, exciseRate: 0 },
    { value: 10, label: 'Parfumuri / Ape de toaletă',vatRate: 0.20, customsRate: 0.06, exciseRate: 0 },
    { value: 11, label: 'Bijuterii',                 vatRate: 0.20, customsRate: 0.10, exciseRate: 0 },
    { value: 12, label: 'Altele',                    vatRate: 0.20, customsRate: 0.05, exciseRate: 0 },
]

export type TaxResult = {
    baseValue: number
    vat: number
    customsDuty: number
    excise: number
    totalTaxes: number
    totalAmount: number
    vatRate: number
    customsRate: number
    exciseRate: number
}

export function calculateTaxes(baseValue: number, category: ProductCategory): TaxResult {
    const vat         = Math.round(baseValue * category.vatRate     * 100) / 100
    const customsDuty = Math.round(baseValue * category.customsRate * 100) / 100
    const excise      = Math.round(baseValue * category.exciseRate  * 100) / 100
    const totalTaxes  = vat + customsDuty + excise
    const totalAmount = baseValue + totalTaxes
    return {
        baseValue,
        vat,
        customsDuty,
        excise,
        totalTaxes,
        totalAmount,
        vatRate:      category.vatRate,
        customsRate:  category.customsRate,
        exciseRate:   category.exciseRate,
    }
}

type Props = {
    baseValue: number
    category: ProductCategory
    currency?: string
}

export default function TaxBreakdown({ baseValue, category, currency = 'EUR' }: Props) {
    if (!baseValue || baseValue <= 0) return null

    const t = calculateTaxes(baseValue, category)

    const rows = [
        {
            label: `TVA (${(t.vatRate * 100).toFixed(0)}%)`,
            formula: `${fmt(t.baseValue, currency)} × ${(t.vatRate * 100).toFixed(0)}%`,
            amount: t.vat,
            color: 'text-blue-700 bg-blue-50 border-blue-100',
        },
        {
            label: `Taxă vamală (${(t.customsRate * 100).toFixed(0)}%)`,
            formula: `${fmt(t.baseValue, currency)} × ${(t.customsRate * 100).toFixed(0)}%`,
            amount: t.customsDuty,
            color: 'text-amber-700 bg-amber-50 border-amber-100',
        },
        ...(t.excise > 0 ? [{
            label: `Acciză (${(t.exciseRate * 100).toFixed(0)}%)`,
            formula: `${fmt(t.baseValue, currency)} × ${(t.exciseRate * 100).toFixed(0)}%`,
            amount: t.excise,
            color: 'text-purple-700 bg-purple-50 border-purple-100',
        }] : []),
    ]

    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Calcul impozite — {category.label}
            </p>

            <div className="space-y-2">
                {rows.map(row => (
                    <div key={row.label} className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${row.color}`}>
                        <div>
                            <span className="font-semibold">{row.label}</span>
                            <span className="ml-2 text-xs opacity-70">= {row.formula}</span>
                        </div>
                        <span className="font-bold">{fmt(row.amount, currency)}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    <span>Total impozite: </span>
                    <span className="font-semibold text-gray-800">{fmt(t.totalTaxes, currency)}</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Total de plată</p>
                    <p className="text-base font-extrabold text-gray-900">{fmt(t.totalAmount, currency)}</p>
                </div>
            </div>
        </div>
    )
}
