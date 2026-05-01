import { useState } from 'react'
import KpiCard from '../../../components/dashboard/KpiCard'

type AuditEntry = {
    id: string
    timestamp: string
    user: string
    role: string
    action: string
    target: string
    details: string
}

const ACTION_COLORS: Record<string, string> = {
    'Creare declarație': 'bg-blue-100 text-blue-800',
    'Modificare status': 'bg-yellow-100 text-yellow-800',
    'Autentificare': 'bg-green-100 text-green-800',
    'Ștergere': 'bg-red-100 text-red-800',
}

const ACTIONS = ['Toate', 'Creare declarație', 'Modificare status', 'Autentificare']

export default function AdminAuditLog() {
    const [filter, setFilter] = useState('Toate')
    const log: AuditEntry[] = []
    const filtered = filter === 'Toate' ? log : log.filter(entry => entry.action === filter)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Audit Log</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Jurnalul de audit va fi afișat când backend-ul va expune evenimentele sistemului.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <KpiCard label="Total evenimente" value={String(log.length)} />
                <KpiCard label="Declarații create" value="0" />
                <KpiCard label="Modificări status" value="0" />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div>
                        <p className="text-base font-semibold text-gray-900">Jurnal de activitate</p>
                        <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {log.length} intrări</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ACTIONS.map(action => (
                            <button key={action} onClick={() => setFilter(action)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    filter === action ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                                {action}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                            <tr>
                                {['Timestamp', 'Utilizator', 'Rol', 'Acțiune', 'Obiect', 'Detalii'].map(h => (
                                    <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                                        Nu există evenimente de audit returnate de backend.
                                    </td>
                                </tr>
                            ) : filtered.map(entry => (
                                <tr key={entry.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{entry.timestamp}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{entry.user}</td>
                                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{entry.role}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {entry.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs text-gray-600">{entry.target}</td>
                                    <td className="px-6 py-3 text-gray-600 max-w-xs truncate">{entry.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
