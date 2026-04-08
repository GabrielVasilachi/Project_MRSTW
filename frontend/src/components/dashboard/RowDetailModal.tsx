import type { ReactNode } from 'react'
import { fmt } from '../../utils/format'

// ── Building blocks ────────────────────────────────────────────────────────────

export function ModalField({ label, value, mono }: {
    label: string
    value: string | number
    mono?: boolean
}) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}:</p>
            <p className={`mt-0.5 text-sm font-semibold text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    )
}

export function ModalBadge({ label, value, color }: {
    label: string
    value: string
    color: string
}) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}:</p>
            <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${color}`}>
                {value}
            </span>
        </div>
    )
}

export function ModalSection({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <div className="px-6 py-5">
            {title && <p className="mb-4 text-base font-semibold text-gray-900">{title}</p>}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {children}
            </div>
        </div>
    )
}

export function TaxesTable({ rows, total, currency }: {
    rows: { label: string; amount: number }[]
    total: number
    currency: string
}) {
    return (
        <div className="rounded-lg border border-green-100 bg-green-50 overflow-hidden">
            {rows.map(r => (
                <div key={r.label} className="flex items-center justify-between px-4 py-2.5 border-b border-green-100 last:border-0">
                    <span className="text-sm text-gray-700">{r.label}</span>
                    <span className="text-sm text-gray-700">{fmt(r.amount, currency)}</span>
                </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2.5 bg-green-100/60">
                <span className="text-sm font-bold text-gray-900">Total de plată</span>
                <span className="text-sm font-bold text-gray-900">{fmt(total, currency)}</span>
            </div>
        </div>
    )
}

// ── Shell ──────────────────────────────────────────────────────────────────────

type Props = {
    title: string
    onClose: () => void
    children: ReactNode
}

export default function RowDetailModal({ title, onClose, children }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
                <div className="pb-2" />
            </div>
        </div>
    )
}
