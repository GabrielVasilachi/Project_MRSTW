import { useState } from 'react'
import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { PhysicalUser } from '../../../types/user'
import StatusBadge from '../../../components/dashboard/StatusBadge'

const TRACK_STEPS = ['Declarație creată', 'Documente încărcate', 'În verificare', 'Aprobat / Respins']

function stepIndex(status: string): number {
    if (status === 'Pending Documents') return 1
    if (status === 'Under Review') return 2
    if (status === 'Approved' || status === 'Rejected') return 3
    return 0
}

export default function IndividualTracking() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]

    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    const userDeclarations = user ? declarations.filter(d => d.user_id === user.id) : []

    const [query, setQuery] = useState('')
    const [searched, setSearched] = useState(false)

    const found = query.trim()
        ? userDeclarations.find(d =>
            d.awb_number.toLowerCase().includes(query.trim().toLowerCase()) ||
            d.id.toLowerCase().includes(query.trim().toLowerCase())
        )
        : undefined

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        setSearched(true)
    }

    const activeStep = found ? stepIndex(found.status) : -1

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tracking / Status</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Verifică rapid stadiul unei declarații sau al unui colet folosind numărul AWB sau ID-ul declarației.
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-3">
                <input
                    type="text"
                    placeholder="Introduceți AWB sau ID declarație (ex: 176-55554444)"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setSearched(false) }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                />
                <button type="submit"
                    className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
                    Caută
                </button>
            </form>

            {searched && !found && query.trim() && (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
                    Nu s-a găsit nicio declarație pentru „{query}".
                </div>
            )}

            {found && (
                <div className="space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-lg font-bold text-gray-900 font-mono">{found.awb_number}</p>
                                <p className="text-sm text-gray-500">{found.description}</p>
                            </div>
                            <StatusBadge status={found.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                            {([
                                ['Cantitate', String(found.quantity)],
                                ['Greutate', `${found.gross_weight} kg`],
                                ['Valoare vamală', `${found.customs_value} MDL`],
                                ['Total taxe', `${found.total_taxes} MDL`],
                            ] as [string, string][]).map(([label, value]) => (
                                <div key={label} className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                                    <p className="mt-1 font-semibold text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="mb-6 text-base font-semibold text-gray-900">Progres declarație</p>
                        <div className="relative">
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />
                            <div className="space-y-6">
                                {TRACK_STEPS.map((step, i) => {
                                    const done = i < activeStep
                                    const active = i === activeStep
                                    const color = active && found.status === 'Rejected'
                                        ? 'bg-red-500' : done || active ? 'bg-gray-900' : 'bg-gray-200'
                                    return (
                                        <div key={step} className="flex items-center gap-4 pl-1">
                                            <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${color}`}>
                                                {(done || active) && (
                                                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8 15.414l-4.707-4.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-sm ${active ? 'font-semibold text-gray-900' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!searched && userDeclarations.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Declarațiile tale recente</p>
                    <div className="space-y-2">
                        {userDeclarations.map(d => (
                            <button key={d.id} type="button"
                                onClick={() => { setQuery(d.awb_number); setSearched(false) }}
                                className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm hover:bg-gray-100 transition-colors">
                                <span className="font-mono text-gray-900">{d.awb_number}</span>
                                <span className="text-gray-500">{d.description}</span>
                                <StatusBadge status={d.status} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
