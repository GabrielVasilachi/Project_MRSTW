import { useState } from 'react'
import KpiCard from '../../../components/dashboard/KpiCard'
import { formatBytes } from '../../../utils/format'
import { useAdminDashboardData } from './adminData'

const ALL_DOC_TYPES = ['Toate', 'PDF', 'Imagine', 'Document', 'Alt tip'] as const
type DocTypeFilter = typeof ALL_DOC_TYPES[number]

function getDocumentType(contentType: string): DocTypeFilter {
    if (contentType.includes('pdf')) return 'PDF'
    if (contentType.includes('image')) return 'Imagine'
    if (contentType.includes('word') || contentType.includes('document') || contentType.includes('sheet')) return 'Document'
    return 'Alt tip'
}

export default function AdminDocuments() {
    const [filter, setFilter] = useState<DocTypeFilter>('Toate')
    const { documents, loading, error } = useAdminDashboardData()
    const filtered = filter === 'Toate' ? documents : documents.filter(document => getDocumentType(document.contentType) === filter)
    const totalSize = documents.reduce((sum, document) => sum + document.fileSize, 0)
    const lastUpload = documents
        .map(document => document.uploadedAt)
        .sort((a, b) => b.localeCompare(a))[0]

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă documentele...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Documente</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Documentele încărcate de utilizatori și returnate de backend.
                </p>
            </div>

            {error ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total documente" value={String(documents.length)} />
                <KpiCard label="Utilizatori cu documente" value={String(new Set(documents.map(document => document.userId)).size)} />
                <KpiCard label="Spațiu utilizat" value={formatBytes(totalSize)} />
                <KpiCard label="Ultimul upload" value={lastUpload ? new Date(lastUpload).toLocaleDateString('ro-RO') : '—'} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div>
                        <p className="text-base font-semibold text-gray-900">Documente încărcate</p>
                        <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {documents.length} înregistrări</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ALL_DOC_TYPES.map(type => (
                            <button key={type} onClick={() => setFilter(type)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    filter === type ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există documente pentru filtrul selectat.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Fișier', 'Declarație', 'Tip', 'Utilizator', 'Rol', 'Dimensiune', 'Data'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(document => (
                                    <tr key={document.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-mono text-xs text-gray-700">{document.fileName}</td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-600">{document.declarationId ? `#${document.declarationId}` : '—'}</td>
                                        <td className="px-6 py-3 text-gray-900">{document.contentType}</td>
                                        <td className="px-6 py-3 font-medium text-gray-900">{document.userName}</td>
                                        <td className="px-6 py-3 text-gray-500">{document.userRole}</td>
                                        <td className="px-6 py-3 text-gray-600">{formatBytes(document.fileSize)}</td>
                                        <td className="px-6 py-3 text-gray-600">{new Date(document.uploadedAt).toLocaleDateString('ro-RO')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
