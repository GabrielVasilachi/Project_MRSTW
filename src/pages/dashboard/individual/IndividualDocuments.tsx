import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { PhysicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'

type DocStatus = 'Aprobat' | 'În verificare' | 'Solicitat' | 'Respins'
const DOC_COLORS: Record<DocStatus, string> = {
    'Aprobat': 'bg-green-100 text-green-800',
    'În verificare': 'bg-blue-100 text-blue-800',
    'Solicitat': 'bg-yellow-100 text-yellow-800',
    'Respins': 'bg-red-100 text-red-800',
}
function docStatus(declStatus: string, idx: number): DocStatus {
    if (declStatus === 'Approved') return 'Aprobat'
    if (declStatus === 'Rejected') return idx === 0 ? 'Respins' : 'Solicitat'
    if (declStatus === 'Under Review') return 'În verificare'
    return idx === 0 ? 'Solicitat' : 'În verificare'
}
const DOC_TYPES = ['Factură comercială', 'Dovadă de plată', 'Declarație vamală']

export default function IndividualDocuments() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]

    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    if (!user) return null

    const userDeclarations = declarations.filter(d => d.user_id === user.id)
    const documents = userDeclarations.flatMap((d, di) =>
        DOC_TYPES.slice(0, di % 2 === 0 ? 3 : 2).map((type, idx) => ({
            id: `${d.id}-doc-${idx}`,
            awb: d.awb_number,
            type,
            filename: `${type.toLowerCase().replace(/ /g, '_')}_${d.awb_number}.pdf`,
            status: docStatus(d.status, idx),
        }))
    )

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentele mele</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Documentele încărcate pentru procesarea declarațiilor vamale (facturi, dovezi de plată etc.).
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total documente" value={String(documents.length)} />
                <KpiCard label="Aprobate" value={String(documents.filter(d => d.status === 'Aprobat').length)} />
                <KpiCard label="În așteptare" value={String(documents.filter(d => d.status !== 'Aprobat').length)} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Documente încărcate</p>
                    <p className="mt-0.5 text-sm text-gray-500">{documents.length} fișiere</p>
                </div>
                {documents.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">Nu aveți documente încărcate.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Fișier', 'Tip document', 'AWB', 'Status'].map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {documents.map(doc => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-mono text-xs text-gray-700">{doc.filename}</td>
                                        <td className="px-6 py-3 text-gray-900">{doc.type}</td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-600">{doc.awb}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${DOC_COLORS[doc.status as DocStatus]}`}>
                                                {doc.status}
                                            </span>
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
