import { useState } from 'react'
import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'

type InvoiceStatus = 'Achitat' | 'În așteptare' | 'Restant'
type Invoice = Declaration & { invoice_no: string; payment_status: InvoiceStatus }

const ALL_FILTERS: (InvoiceStatus | 'Toate')[] = ['Toate', 'Achitat', 'În așteptare', 'Restant']

export default function AdminInvoices() {
    const [filter, setFilter] = useState<InvoiceStatus | 'Toate'>('Toate')
    const invoices: Invoice[] = []
    const filtered = filter === 'Toate' ? invoices : invoices.filter(invoice => invoice.payment_status === filter)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Invoice-uri</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Facturile vor fi afișate aici când backend-ul va expune datele pentru plăți și declarații.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total facturi" value={String(invoices.length)} />
                <KpiCard label="Achitate" value="0" sub={fmt(0)} />
                <KpiCard label="În așteptare" value="0" />
                <KpiCard label="Restante" value="0" sub={`${fmt(0)} neîncasați`} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div>
                        <p className="text-base font-semibold text-gray-900">Facturi</p>
                        <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {invoices.length} înregistrări</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ALL_FILTERS.map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există facturi returnate de backend.</p>
            </div>
        </div>
    )
}
