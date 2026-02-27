import { useState } from 'react'
import physicalData from '../../../_mock/mock_persoana_fizica.json'
import juridicalData from '../../../_mock/mock_persoana_juridica.json'
import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'

type DocStatus = 'Aprobat' | 'În verificare' | 'Solicitat' | 'Respins'

const DOC_COLORS: Record<DocStatus, string> = {
    'Aprobat': 'bg-green-100 text-green-800',
    'În verificare': 'bg-blue-100 text-blue-800',
    'Solicitat': 'bg-yellow-100 text-yellow-800',
    'Respins': 'bg-red-100 text-red-800',
}

function docStatusFromDecl(status: string, index: number): DocStatus {
    if (status === 'Approved') return 'Aprobat'
    if (status === 'Rejected') return index === 0 ? 'Respins' : 'Solicitat'
    if (status === 'Under Review') return 'În verificare'
    return index === 0 ? 'Solicitat' : 'În verificare'
}

const DOC_TYPES = ['Factură comercială', 'Dovadă de plată', 'Declarație vamală', 'Certificat de origine', 'Listă de ambalaj']
const ALL_DOC_STATUSES: (DocStatus | 'Toate')[] = ['Toate', 'Aprobat', 'În verificare', 'Solicitat', 'Respins']

export default function AdminDocuments() {
    const [filter, setFilter] = useState<DocStatus | 'Toate'>('Toate')

    const allDeclarations = [
        ...physicalData.declarations as Declaration[],
        ...juridicalData.declarations as Declaration[],
    ]

    function resolveUser(userId: string) {
        const ph = physicalData.users.find(u => u.id === userId)
        if (ph) return { name: ph.full_name, type: 'Fizică' }
        const ju = juridicalData.users.find(u => u.id === userId)
        return { name: ju?.company_name ?? userId, type: 'Juridică' }
    }

    const documents = allDeclarations.flatMap((d, di) =>
        DOC_TYPES.slice(0, di % 2 === 0 ? 3 : 2).map((docType, idx) => ({
            id: `${d.id}-doc-${idx}`,
            decl_id: d.id,
            awb: d.awb_number,
            user_id: d.user_id,
            type: docType,
            filename: `${docType.toLowerCase().replace(/ /g, '_')}_${d.awb_number}.pdf`,
            status: docStatusFromDecl(d.status, idx) as DocStatus,
        }))
    )

    const filtered = filter === 'Toate' ? documents : documents.filter(doc => doc.status === filter)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Documente</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Documentele încărcate de utilizatori – verificați, aprobați sau solicitați completări.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total documente" value={String(documents.length)} />
                <KpiCard label="Aprobate" value={String(documents.filter(d => d.status === 'Aprobat').length)} />
                <KpiCard label="În verificare" value={String(documents.filter(d => d.status === 'În verificare').length)} />
                <KpiCard label="Solicitate / Respinse" value={String(documents.filter(d => d.status === 'Solicitat' || d.status === 'Respins').length)} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div>
                        <p className="text-base font-semibold text-gray-900">Documente încărcate</p>
                        <p className="mt-0.5 text-sm text-gray-500">{filtered.length} din {documents.length} înregistrări</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ALL_DOC_STATUSES.map(s => (
                            <button key={s} onClick={() => setFilter(s)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                                {s}
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
                                    {['Fișier', 'Tip document', 'AWB', 'Utilizator', 'Tip cont', 'Status'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(doc => {
                                    const user = resolveUser(doc.user_id)
                                    return (
                                        <tr key={doc.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-mono text-xs text-gray-700">{doc.filename}</td>
                                            <td className="px-6 py-3 text-gray-900">{doc.type}</td>
                                            <td className="px-6 py-3 font-mono text-xs text-gray-600">{doc.awb}</td>
                                            <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-3 text-gray-500">{user.type}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${DOC_COLORS[doc.status]}`}>
                                                    {doc.status}
                                                </span>
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
