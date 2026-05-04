import { useEffect, useState } from 'react'
import { downloadDocumentFile, getDocumentsByUserId } from '../../../api/documentsApi'
import type { DocumentInfo } from '../../../api/types/document'
import { getSession } from '../../../auth/auth.session'
import KpiCard from '../../../components/dashboard/KpiCard'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import { formatBytes } from '../../../utils/format'
import { useBusinessProfileName } from './businessProfileData'

export default function BusinessDocuments() {
    const companyName = useBusinessProfileName()
    const session = getSession()
    const parsedUserId = session?.userId ? Number(session.userId) : null
    const userId = parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : null
    const [documents, setDocuments] = useState<DocumentInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            setError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        const currentUserId = userId
        let ignore = false

        async function loadDocuments() {
            try {
                const response = await getDocumentsByUserId(currentUserId)

                if (!ignore) {
                    setDocuments(response ?? [])
                    setError(null)
                }
            } catch {
                if (!ignore) {
                    setError('Nu s-au putut încărca documentele companiei.')
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        loadDocuments()

        return () => {
            ignore = true
        }
    }, [userId])

    async function downloadDocument(id: number, fileName: string) {
        try {
            const file = await downloadDocumentFile(id)
            const fileUrl = URL.createObjectURL(file)
            const a = document.createElement('a')
            a.href = fileUrl
            a.download = fileName
            a.click()
            window.setTimeout(() => URL.revokeObjectURL(fileUrl), 0)
        } catch {
            setError('Nu s-a putut descărca documentul.')
        }
    }

    return (
        <div className="space-y-8">
            <BusinessVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Documente companie</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Documentele firmei <strong>{companyName}</strong> încărcate în backend.
                </p>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total documente" value={String(documents.length)} />
                <KpiCard label="Spațiu utilizat" value={formatBytes(documents.reduce((sum, document) => sum + document.fileSize, 0))} />
                <KpiCard label="Ultimul upload" value={
                    documents.length > 0
                        ? new Date(documents[0].uploadedAt).toLocaleDateString('ro-RO')
                        : '—'
                } />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Documente încărcate</p>
                    <p className="mt-0.5 text-sm text-gray-500">{documents.length} fișiere</p>
                </div>
                {loading ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Se încarcă...</p>
                ) : documents.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există documente încărcate pentru companie.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Fișier', 'Tip', 'Dimensiune', 'Data', 'Acțiuni'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {documents.map(document => (
                                    <tr key={document.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-mono text-xs text-gray-700">{document.fileName}</td>
                                        <td className="px-6 py-3 text-gray-500 text-xs">{document.contentType}</td>
                                        <td className="px-6 py-3 text-gray-600">{formatBytes(document.fileSize)}</td>
                                        <td className="px-6 py-3 text-gray-600">{new Date(document.uploadedAt).toLocaleDateString('ro-RO')}</td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() => downloadDocument(document.id, document.fileName)}
                                                className="text-blue-600 hover:underline text-xs font-medium"
                                            >
                                                Descarcă
                                            </button>
                                        </td>
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
