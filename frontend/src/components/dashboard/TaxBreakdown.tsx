import { useEffect, useState } from 'react'
import { fmt } from '../../utils/format'
import { calculateTaxes } from '../../api/taxCalculatorApi'
import type { TaxCalculationResult, TaxCategory } from '../../api/types/taxCalculator'

type Props = {
    baseValue: number
    category: TaxCategory
    currency?: string
}

export default function TaxBreakdown({ baseValue, category, currency = 'EUR' }: Props) {
    const [taxes, setTaxes] = useState<TaxCalculationResult | null>(null)

    useEffect(() => {
        let ignore = false

        if (!baseValue || baseValue <= 0) {
            return
        }

        calculateTaxes({
            baseValue,
            category: category.value,
        }).then((result) => {
            if (!ignore) {
                setTaxes(result)
            }
        }).catch(() => {
            if (!ignore) {
                setTaxes(null)
            }
        })

        return () => {
            ignore = true
        }
    }, [baseValue, category.value])

    if (!baseValue || baseValue <= 0) return null

    if (!taxes) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                Se calculează taxele...
            </div>
        )
    }

    const rows = [
        {
            label: `TVA (${(taxes.vatRate * 100).toFixed(0)}%)`,
            formula: `${fmt(taxes.baseValue, currency)} × ${(taxes.vatRate * 100).toFixed(0)}%`,
            amount: taxes.vat,
            color: 'text-blue-700 bg-blue-50 border-blue-100',
        },
        {
            label: `Taxă vamală (${(taxes.customsDutyRate * 100).toFixed(0)}%)`,
            formula: `${fmt(taxes.baseValue, currency)} × ${(taxes.customsDutyRate * 100).toFixed(0)}%`,
            amount: taxes.customsDuty,
            color: 'text-amber-700 bg-amber-50 border-amber-100',
        },
        ...(taxes.excise > 0 ? [{
            label: `Acciză (${(taxes.exciseRate * 100).toFixed(0)}%)`,
            formula: `${fmt(taxes.baseValue, currency)} × ${(taxes.exciseRate * 100).toFixed(0)}%`,
            amount: taxes.excise,
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
                    <span className="font-semibold text-gray-800">{fmt(taxes.totalTaxes, currency)}</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Total de plată</p>
                    <p className="text-base font-extrabold text-gray-900">{fmt(taxes.totalAmount, currency)}</p>
                </div>
            </div>
        </div>
    )
}
