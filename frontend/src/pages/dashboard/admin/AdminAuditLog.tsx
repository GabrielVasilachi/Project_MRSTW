import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { getAuditLogs } from '../../../api/auditLogsApi'
import type { AuditLogEntry } from '../../../api/types/auditLog'
import KpiCard from '../../../components/dashboard/KpiCard'

const ACTION_COLORS: Record<string, string> = {
    'Creare utilizator': 'bg-green-100 text-green-800',
    'Încărcare document': 'bg-blue-100 text-blue-800',
    'Creare token activare': 'bg-yellow-100 text-yellow-800',
    'Scanare colet': 'bg-purple-100 text-purple-800',
}

const ACTIONS = ['Toate', 'Creare utilizator', 'Încărcare document', 'Creare token activare', 'Scanare colet']

const TRUNCATE_LENGTH = 60

function getApiErrorMessage(error: unknown) {
    if (axios.isAxiosError(error) && typeof error.response?.data === 'string') {
        return error.response.data
    }
    return 'Nu s-au putut încărca evenimentele de audit.'
}

function formatTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleString('ro-RO')
}

function DetailsCell({ details, onExpand }: { details: string; onExpand: () => void }) {
    if (details.length <= TRUNCATE_LENGTH) {
        return <span className="text-gray-600">{details}</span>
    }
    return (
        <span className="text-gray-600">
            {details.slice(0, TRUNCATE_LENGTH)}
            <button
                type="button"
                onClick={onExpand}
                className="ml-1 inline-flex items-center rounded px-1 py-0.5 text-xs font-bold text-sky-600 hover:bg-sky-50 hover:text-sky-800"
                title="Vezi detalii complete"
            >
                ···
            </button>
        </span>
    )
}

function DetailsModal({ entry, onClose }: { entry: AuditLogEntry; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/40"
                aria-label="Închide"
            />
            <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Detalii eveniment</p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3 px-6 py-5">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Timestamp</p>
                            <p className="mt-0.5 font-mono text-gray-700">{formatTimestamp(entry.timestamp)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Acțiune</p>
                            <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-700'}`}>
                                {entry.action}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Actor</p>
                            <p className="mt-0.5 text-gray-700">{entry.actorName ?? 'Sistem'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Utilizator</p>
                            <p className="mt-0.5 font-medium text-gray-900">{entry.user}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Rol</p>
                            <p className="mt-0.5 text-gray-700">{entry.role}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Obiect</p>
                            <p className="mt-0.5 font-mono text-xs text-gray-600">{entry.target}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Detalii</p>
                        <p className="mt-1 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                            {entry.details}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminAuditLog() {
    const [filter, setFilter] = useState('Toate')
    const [log, setLog] = useState<AuditLogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null)

    const filtered = filter === 'Toate' ? log : log.filter(entry => entry.action === filter)
    const documentLogs = log.filter(entry => entry.action === 'Încărcare document')
    const activationTokenLogs = log.filter(entry => entry.action === 'Creare token activare')
    const packageLogs = log.filter(entry => entry.action === 'Scanare colet')

    const loadAuditLogs = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        try {
            const response = await getAuditLogs()
            setLog(response ?? [])
            setError(null)
        } catch (error: unknown) {
            setError(getApiErrorMessage(error))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        loadAuditLogs()
    }, [loadAuditLogs])

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            loadAuditLogs(true)
        }, 15000)
        return () => window.clearInterval(intervalId)
    }, [loadAuditLogs])

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă evenimentele de audit...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Audit Log</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Evenimente generate din datele existente despre utilizatori, documente, tokenuri de activare și colete.
                </p>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total evenimente" value={String(log.length)} />
                <KpiCard label="Documente încărcate" value={String(documentLogs.length)} />
                <KpiCard label="Tokenuri activare" value={String(activationTokenLogs.length)} />
                <KpiCard label="Colete scanate" value={String(packageLogs.length)} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div>
                        <p className="text-base font-semibold text-gray-900">Jurnal de activitate</p>
                        <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {log.length} intrări</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => loadAuditLogs(true)}
                            disabled={refreshing}
                            className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white transition-colors disabled:bg-gray-400"
                        >
                            {refreshing ? 'Se reîncarcă...' : 'Reîncarcă'}
                        </button>
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
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                            <tr>
                                {['Timestamp', 'Actor', 'Utilizator', 'Rol', 'Acțiune', 'Obiect', 'Detalii'].map(h => (
                                    <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-400">
                                        Nu există evenimente de audit pentru filtrul selectat.
                                    </td>
                                </tr>
                            ) : filtered.map(entry => (
                                <tr key={entry.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{formatTimestamp(entry.timestamp)}</td>
                                    <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{entry.actorName ?? 'Sistem'}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{entry.user}</td>
                                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{entry.role}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {entry.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs text-gray-600">{entry.target}</td>
                                    <td className="px-6 py-3 max-w-xs">
                                        <DetailsCell
                                            details={entry.details}
                                            onExpand={() => setSelectedEntry(entry)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedEntry && (
                <DetailsModal
                    entry={selectedEntry}
                    onClose={() => setSelectedEntry(null)}
                />
            )}
        </div>
    )
}
