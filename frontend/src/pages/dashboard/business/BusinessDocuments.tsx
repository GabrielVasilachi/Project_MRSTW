import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { deleteDocument as deleteDocumentRequest, downloadDocumentFile, getDocumentsByUserId, uploadDocument } from '../../../api/documentsApi'
import { getBusinessProfileByUserId } from '../../../api/profilesApi'
import type { DocumentInfo } from '../../../api/types/document'
import { getSession } from '../../../auth/auth.session'
import KpiCard from '../../../components/dashboard/KpiCard'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import { formatBytes } from '../../../utils/format'
import { hasMissingBusinessProfileData } from '../../../utils/profileValidation'
import { useBusinessProfileName } from './businessProfileData'

export default function BusinessDocuments() {
    const companyName = useBusinessProfileName()
    const session = getSession()
    const parsedUserId = session?.userId ? Number(session.userId) : null
    const userId = parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : null
    const [documents, setDocuments] = useState<DocumentInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [needsVerification, setNeedsVerification] = useState(false)

    useEffect(() => {
        if (!userId) {
            setNeedsVerification(false)
            return
        }

        const currentUserId = userId
        let ignore = false

        async function loadProfileStatus() {
            try {
                const profile = await getBusinessProfileByUserId(currentUserId)

                if (!ignore) {
                    setNeedsVerification(hasMissingBusinessProfileData(profile))
                }
            } catch {
                if (!ignore) {
                    setNeedsVerification(false)
                }
            }
        }

        loadProfileStatus()

        return () => {
            ignore = true
        }
    }, [userId])

    const loadDocuments = useCallback(async () => {
        if (!userId) {
            setLoading(false)
            setError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        try {
            const response = await getDocumentsByUserId(userId)
            setDocuments(response ?? [])
            setError(null)
        } catch {
            setError('Nu s-au putut încărca documentele companiei.')
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => { loadDocuments() }, [loadDocuments])

    async function uploadFile(file: File) {
        if (!userId) {
            setError('Sesiune invalidă.')
            return
        }

        setUploading(true)
        setError(null)
        setSuccessMsg(null)

        try {
            await uploadDocument(userId, file)
            setSuccessMsg(`"${file.name}" a fost încărcat cu succes.`)
            await loadDocuments()
        } catch (error: unknown) {
            const message = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: unknown } }).response?.data
                : null
            setError(typeof message === 'string' ? message : 'Eroare la încărcare.')
        } finally {
            setUploading(false)
        }
    }

    function onFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) uploadFile(file)
        e.target.value = ''
    }

    function onDrop(e: DragEvent) {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) uploadFile(file)
    }

    async function deleteDocument(id: number) {
        if (!userId) return

        try {
            await deleteDocumentRequest(id, userId)
            setDocuments(prev => prev.filter(document => document.id !== id))
        } catch {
            setError('Nu s-a putut șterge documentul.')
        }
    }

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
            {needsVerification ? <BusinessVerificationBanner /> : null}

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
            {successMsg ? (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successMsg}
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
                                            <button
                                                onClick={() => deleteDocument(document.id)}
                                                className="ml-3 text-red-500 hover:underline text-xs font-medium"
                                            >
                                                Șterge
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
