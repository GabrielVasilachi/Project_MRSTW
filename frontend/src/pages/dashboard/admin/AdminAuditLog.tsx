import { useState } from 'react'
import physicalData from '../../../_mock/mock_persoana_fizica.json'
import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import type { Declaration } from '../../../types/declaration'
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

const BASE_DATE = new Date('2025-02-10T08:00:00')

function makeDate(offsetHours: number): string {
    const d = new Date(BASE_DATE.getTime() + offsetHours * 3_600_000)
    return d.toLocaleString('ro-MD', { dateStyle: 'short', timeStyle: 'short' })
}

function buildAuditLog(): AuditEntry[] {
    const entries: AuditEntry[] = []
    let h = 0

    function resolveUser(userId: string) {
        const ph = physicalData.users.find(u => u.id === userId)
        if (ph) return { name: ph.full_name, role: 'Persoană fizică' }
        const ju = juridicalData.users.find(u => u.id === userId)
        return { name: ju?.company_name ?? userId, role: 'Persoană juridică' }
    }

    const allDeclarations = [
        ...physicalData.declarations as Declaration[],
        ...juridicalData.declarations as Declaration[],
    ]

    allDeclarations.forEach((d) => {
        const u = resolveUser(d.user_id)
        entries.push({
            id: `log-create-${d.id}`,
            timestamp: makeDate(h),
            user: u.name,
            role: u.role,
            action: 'Creare declarație',
            target: d.awb_number,
            details: `Declarație pentru "${d.description}" creată cu succes.`,
        })
        h += 2

        if (d.status !== 'Pending Documents') {
            entries.push({
                id: `log-review-${d.id}`,
                timestamp: makeDate(h),
                user: 'Admin MRSTW',
                role: 'Administrator',
                action: 'Modificare status',
                target: d.awb_number,
                details: `Status schimbat din "Pending Documents" în "${d.status}".`,
            })
            h += 3
        }
    })

    entries.push({
        id: 'log-login-admin-1',
        timestamp: makeDate(h),
        user: 'Admin MRSTW',
        role: 'Administrator',
        action: 'Autentificare',
        target: 'Sistem',
        details: 'Autentificare reușită la panoul de administrare.',
    })

    return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
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
    const log = buildAuditLog()
    const filtered = filter === 'Toate' ? log : log.filter(e => e.action === filter)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Istoricul tuturor acțiunilor importante din sistem – cine a făcut o modificare și la ce moment.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <KpiCard label="Total evenimente" value={String(log.length)} />
                <KpiCard label="Declarații create" value={String(log.filter(e => e.action === 'Creare declarație').length)} />
                <KpiCard label="Modificări status" value={String(log.filter(e => e.action === 'Modificare status').length)} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div>
                        <p className="text-base font-semibold text-gray-900">Jurnal de activitate</p>
                        <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {log.length} intrări</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ACTIONS.map(a => (
                            <button key={a} onClick={() => setFilter(a)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    filter === a ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                                {a}
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
                            {filtered.map(entry => (
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
