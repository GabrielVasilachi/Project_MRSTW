import { useEffect, useRef, useState } from 'react'
import { getSession } from '../../../auth/auth.session'
import { useAxios } from '../../../api/useAxios'
import KpiCard from '../../../components/dashboard/KpiCard'
import AccountVerificationBanner from '../../../components/dashboard/AccountVerificationBanner'

type DocumentInfo = {
    id: number
    userId: number
    fileName: string
    contentType: string
    fileSize: number
    uploadedAt: string
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function IndividualDocuments() {
    const { api } = useAxios()
    const session = getSession()
    const userId = session?.userId
        ? (parseInt(session.userId) || parseInt(session.userId.replace(/\D/g, '')) || null)
        : null

    const [documents, setDocuments] = useState<DocumentInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function loadDocuments() {
        if (!userId) return
        try {
            const res = await api.get<DocumentInfo[]>(`/documents/by-user/${userId}`)
            setDocuments(res.data ?? [])
        } catch {
            setError('Nu s-au putut încărca documentele.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadDocuments() }, [userId])

    async function uploadFile(file: File) {
        if (!userId) { setError('Sesiune invalidă.'); return }

        setUploading(true)
        setError(null)
        setSuccessMsg(null)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', String(userId))

        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSuccessMsg(`"${file.name}" a fost încărcat cu succes.`)
            await loadDocuments()
        } catch (e: any) {
            setError(e?.response?.data ?? 'Eroare la încărcare.')
        } finally {
            setUploading(false)
        }
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) uploadFile(file)
        e.target.value = ''
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) uploadFile(file)
    }

    async function deleteDocument(id: number) {
        if (!userId) return
        try {
            await api.delete(`/documents/${id}?userId=${userId}`)
            setDocuments(prev => prev.filter(d => d.id !== id))
        } catch {
            setError('Eroare la ștergere.')
        }
    }

    function downloadDocument(id: number, fileName: string) {
        const url = `${api.defaults.baseURL}/documents/${id}/file`
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
    }

    return (
        <div className="space-y-8">
            <AccountVerificationBanner />

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentele mele</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Încărcați și gestionați documentele pentru declarațiile vamale (facturi, dovezi de plată etc.).
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total documente" value={String(documents.length)} />
                <KpiCard label="Spațiu utilizat" value={formatBytes(documents.reduce((s, d) => s + d.fileSize, 0))} />
                <KpiCard label="Ultimul upload" value={
                    documents.length > 0
                        ? new Date(documents[0].uploadedAt).toLocaleDateString('ro-RO')
                        : '—'
                } />
            </div>

            {/* Upload zone */}
            <div
                className={`rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                        <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Trageți un fișier aici sau{' '}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 hover:underline"
                                disabled={uploading}
                            >
                                selectați din calculator
                            </button>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">PDF, JPG, PNG, DOCX — max 10 MB</p>
                    </div>
                    {uploading && (
                        <p className="text-sm font-medium text-blue-600 animate-pulse">Se încarcă...</p>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.xlsx,.xls"
                    onChange={onFileChange}
                />
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                    {successMsg}
                </div>
            )}

            {/* Documents list */}
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Documente încărcate</p>
                    <p className="mt-0.5 text-sm text-gray-500">{documents.length} fișiere</p>
                </div>

                {loading ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Se încarcă...</p>
                ) : documents.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu aveți documente încărcate.</p>
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
                                {documents.map(doc => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                                <span className="font-medium text-gray-900 truncate max-w-xs">{doc.fileName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-500 text-xs">{doc.contentType}</td>
                                        <td className="px-6 py-3 text-gray-600">{formatBytes(doc.fileSize)}</td>
                                        <td className="px-6 py-3 text-gray-600">
                                            {new Date(doc.uploadedAt).toLocaleDateString('ro-RO')}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => downloadDocument(doc.id, doc.fileName)}
                                                    className="text-blue-600 hover:underline text-xs font-medium"
                                                >
                                                    Descarcă
                                                </button>
                                                <button
                                                    onClick={() => deleteDocument(doc.id)}
                                                    className="text-red-500 hover:underline text-xs font-medium"
                                                >
                                                    Șterge
                                                </button>
                                            </div>
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
