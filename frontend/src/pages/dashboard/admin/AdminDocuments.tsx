import axios from 'axios'
import { useEffect, useState } from 'react'
import { getAllDocuments, getDocumentFileUrl } from '../../../api/documentsApi'
import type { DocumentInfoWithUser } from '../../../api/types/document'
import KpiCard from '../../../components/dashboard/KpiCard'
import { formatBytes } from '../../../utils/format'

const ALL_DOC_TYPES = ['Toate', 'PDF', 'Imagine', 'Document', 'Alt tip'] as const
type DocTypeFilter = typeof ALL_DOC_TYPES[number]

function getDocumentType(contentType: string): DocTypeFilter {
    if (contentType.includes('pdf')) return 'PDF'
    if (contentType.includes('image')) return 'Imagine'
    if (contentType.includes('word') || contentType.includes('document') || contentType.includes('sheet')) return 'Document'
    return 'Alt tip'
}

const TYPE_COLORS: Record<DocTypeFilter, string> = {
    'Toate': 'bg-gray-100 text-gray-700',
    'PDF': 'bg-red-100 text-red-700',
    'Imagine': 'bg-blue-100 text-blue-700',
    'Document': 'bg-green-100 text-green-700',
    'Alt tip': 'bg-gray-100 text-gray-600',
}

export default function AdminDocuments() {
    const [filter, setFilter] = useState<DocTypeFilter>('Toate')
    const [documents, setDocuments] = useState<DocumentInfoWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getAllDocuments()
            .then(data => {
                setDocuments(data ?? [])
                setError(null)
            })
            .catch(err => {
                if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                    setError(err.response.data)
                } else {
                    setError('Nu s-au putut încărca documentele.')
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const filtered = filter === 'Toate' ? documents : documents.filter(d => getDocumentType(d.contentType) === filter)
    const totalSize = documents.reduce((sum, d) => sum + d.fileSize, 0)
    const lastUpload = documents.map(d => d.uploadedAt).sort((a, b) => b.localeCompare(a))[0]

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
                    Toate documentele încărcate de utilizatori individuali și companii.
                </p>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total documente" value={String(documents.length)} />
                <KpiCard label="Utilizatori cu documente" value={String(new Set(documents.map(d => d.userId)).size)} />
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
                    <p className="px-6 py-8 text-center text-sm text-gray-400">
                        {documents.length === 0
                            ? 'Nu există documente încărcate.'
                            : 'Nu există documente pentru filtrul selectat.'}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Fișier', 'Tip', 'Utilizator', 'Rol', 'Dimensiune', 'Data', 'Acțiuni'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(doc => {
                                    const docType = getDocumentType(doc.contentType)
                                    return (
                                        <tr key={doc.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-mono text-xs text-gray-700 max-w-xs truncate" title={doc.fileName}>
                                                {doc.fileName}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[docType]}`}>
                                                    {docType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{doc.userFullName}</td>
                                            <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{doc.userRole}</td>
                                            <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{formatBytes(doc.fileSize)}</td>
                                            <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                                                {new Date(doc.uploadedAt).toLocaleDateString('ro-RO')}
                                            </td>
                                            <td className="px-6 py-3">
                                                <a
                                                    href={getDocumentFileUrl(doc.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100"
                                                >
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Descarcă
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
