import { Fragment, useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { getBusinessDeclarationsByUserId } from '../../../api/businessDeclarationsApi'
import { deleteDocument as deleteDocumentRequest, downloadDocumentFile, getDocumentsByUserId, uploadDocument } from '../../../api/documentsApi'
import { getBusinessProfileByUserId } from '../../../api/profilesApi'
import type { BusinessDeclarationResponse } from '../../../api/types/businessDeclaration'
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
    const [declarations, setDeclarations] = useState<BusinessDeclarationResponse[]>([])
    const [selectedDeclarationIds, setSelectedDeclarationIds] = useState<number[]>([])
    const [pendingUploadDeclarationIds, setPendingUploadDeclarationIds] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
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

    const loadDeclarations = useCallback(async () => {
        if (!userId) return

        try {
            const response = await getBusinessDeclarationsByUserId(userId)
            setDeclarations(response ?? [])
        } catch {
            setError('Nu s-au putut încărca declarațiile companiei.')
        }
    }, [userId])

    useEffect(() => { loadDeclarations() }, [loadDeclarations])

    async function uploadFiles(files: File[], declarationIds: number[]) {
        if (!userId) {
            setError('Sesiune invalidă.')
            return
        }

        if (declarationIds.length === 0) {
            setError('Selectați cel puțin o declarație.')
            return
        }

        setUploading(true)
        setError(null)
        setSuccessMsg(null)

        try {
            await Promise.all(declarationIds.flatMap(declarationId =>
                files.map(file => uploadDocument(userId, declarationId, file))
            ))
            setSuccessMsg(`${files.length} fișier(e) încărcate pentru ${declarationIds.length} declarație(i).`)
            setSelectedDeclarationIds([])
            await loadDocuments()
        } catch (error: unknown) {
            const message = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: unknown } }).response?.data
                : null
            setError(typeof message === 'string' ? message : 'Eroare la încărcare.')
        } finally {
            setUploading(false)
            setPendingUploadDeclarationIds([])
        }
    }

    function onFileChange(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])

        if (files.length > 0) {
            uploadFiles(files, pendingUploadDeclarationIds)
        }

        e.target.value = ''
    }

    function openUpload(declarationIds: number[]) {
        setPendingUploadDeclarationIds(declarationIds)
        fileInputRef.current?.click()
    }

    function toggleDeclarationSelection(declarationId: number) {
        setSelectedDeclarationIds(current =>
            current.includes(declarationId)
                ? current.filter(id => id !== declarationId)
                : [...current, declarationId]
        )
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

    function getDeclarationTitle(declaration: BusinessDeclarationResponse) {
        return `Declarația #${declaration.id} - ${declaration.productName}`
    }

    function getDeclarationDocuments(declarationId: number) {
        return documents.filter(document => document.declarationId === declarationId)
    }

    function getDocumentDeclarationTitle(document: DocumentInfo) {
        const declaration = declarations.find(item => item.id === document.declarationId)
        return declaration ? getDeclarationTitle(declaration) : document.declarationId ? `Declarația #${document.declarationId}` : '—'
    }

    const selectedCount = selectedDeclarationIds.length
    const hasMultipleSelection = selectedCount >= 2

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

            <div className={`overflow-hidden transition-all duration-300 ease-out ${hasMultipleSelection ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-sm font-medium text-blue-900">{selectedCount} declarații selectate</p>
                    <button
                        type="button"
                        onClick={() => openUpload(selectedDeclarationIds)}
                        disabled={uploading}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {uploading ? 'Se încarcă...' : 'Încarcă fișiere'}
                    </button>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Declarații</p>
                    <p className="mt-0.5 text-sm text-gray-500">Selectați declarații sau încărcați fișiere separat pe fiecare declarație.</p>
                </div>

                {declarations.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există declarații pentru care să încărcați documente.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    <th className="w-12 px-6 py-3 font-medium" />
                                    {['Declarație', 'Tracking', 'Documente', 'Data', hasMultipleSelection ? null : 'Acțiuni'].filter(Boolean).map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {declarations.map(declaration => {
                                    const declarationDocuments = getDeclarationDocuments(declaration.id)
                                    const isSelected = selectedDeclarationIds.includes(declaration.id)

                                    return (
                                        <Fragment key={declaration.id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleDeclarationSelection(declaration.id)}
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        aria-label={`Selectați ${getDeclarationTitle(declaration)}`}
                                                    />
                                                </td>
                                                <td className="px-6 py-3 font-medium text-gray-900">{getDeclarationTitle(declaration)}</td>
                                                <td className="px-6 py-3 font-mono text-xs text-gray-600">{declaration.trackingCode}</td>
                                                <td className="px-6 py-3 text-gray-600">{declarationDocuments.length}</td>
                                                <td className="px-6 py-3 text-gray-600">{new Date(declaration.createdAt).toLocaleDateString('ro-RO')}</td>
                                                {!hasMultipleSelection ? (
                                                    <td className="px-6 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => openUpload([declaration.id])}
                                                            disabled={uploading}
                                                            className="rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                                                        >
                                                            Încarcă fișiere
                                                        </button>
                                                    </td>
                                                ) : null}
                                            </tr>
                                            {declarationDocuments.length > 0 ? (
                                                <tr className="bg-gray-50">
                                                    <td />
                                                    <td colSpan={hasMultipleSelection ? 4 : 5} className="px-6 py-3">
                                                        <div className="space-y-2">
                                                            {declarationDocuments.map(document => (
                                                                <div key={document.id} className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                                                                    <span className="font-medium text-gray-800">{document.fileName}</span>
                                                                    <span>{formatBytes(document.fileSize)} · {new Date(document.uploadedAt).toLocaleDateString('ro-RO')}</span>
                                                                    <div className="flex gap-3">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => downloadDocument(document.id, document.fileName)}
                                                                            className="font-medium text-blue-600 hover:underline"
                                                                        >
                                                                            Descarcă
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => deleteDocument(document.id)}
                                                                            className="font-medium text-red-500 hover:underline"
                                                                        >
                                                                            Șterge
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : null}
                                        </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Istoric documente</p>
                    <p className="mt-0.5 text-sm text-gray-500">{documents.length} fișiere încărcate</p>
                </div>

                {documents.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu există documente încărcate pentru companie.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Fișier', 'Declarație', 'Dimensiune', 'Data', 'Acțiuni'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {documents.map(document => (
                                    <tr key={document.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">{document.fileName}</td>
                                        <td className="px-6 py-3 text-gray-600">{getDocumentDeclarationTitle(document)}</td>
                                        <td className="px-6 py-3 text-gray-600">{formatBytes(document.fileSize)}</td>
                                        <td className="px-6 py-3 text-gray-600">{new Date(document.uploadedAt).toLocaleDateString('ro-RO')}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => downloadDocument(document.id, document.fileName)}
                                                    className="text-xs font-medium text-blue-600 hover:underline"
                                                >
                                                    Descarcă
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteDocument(document.id)}
                                                    className="text-xs font-medium text-red-500 hover:underline"
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

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.xlsx,.xls"
                onChange={onFileChange}
            />

            {loading ? (
                <p className="text-center text-sm text-gray-400">Se încarcă documentele...</p>
            ) : null}
        </div>
    )
}
