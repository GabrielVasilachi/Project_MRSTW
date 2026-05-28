import { useMemo, useState } from 'react'
import type { PackageResponse } from '../../api/types/package'

type PackagesTableProps = {
    packages: PackageResponse[]
    emptyMessage: string
    recipientType?: 'individual' | 'business' | 'admin'
    showUserId?: boolean
}

const PACKAGE_STATUS_LABELS: Record<number, string> = {
    0: 'În așteptare',
    1: 'Așteaptă documente',
    2: 'În verificare',
    3: 'Taxe calculate',
    4: 'Gata de plată',
    5: 'Plătit',
    6: 'Eliberat',
    7: 'Respins',
}

function getPackageName(packageItem: PackageResponse, recipientType: PackagesTableProps['recipientType']) {
    if (recipientType === 'individual') {
        return packageItem.declarationProductName
            || packageItem.fullName
            || packageItem.trackingCode
    }

    return packageItem.declarationProductName
        || packageItem.companyName
        || packageItem.fullName
        || packageItem.contactPerson
        || packageItem.trackingCode
}

function getDeclarationLabel(packageItem: PackageResponse) {
    if (!packageItem.hasDeclaration) {
        return 'Fără declarație'
    }

    return packageItem.declarationId
        ? `Declarația #${packageItem.declarationId}`
        : 'Declarație creată'
}

function getDeclarationBadgeClass(hasDeclaration: boolean) {
    return hasDeclaration
        ? 'bg-green-100 text-green-700'
        : 'bg-amber-100 text-amber-700'
}

function getRecipientName(packageItem: PackageResponse, recipientType: PackagesTableProps['recipientType']) {
    if (recipientType === 'individual') {
        return packageItem.fullName || '—'
    }

    return packageItem.companyName || packageItem.fullName || packageItem.contactPerson || '—'
}

export default function PackagesTable({ packages, emptyMessage, recipientType = 'admin', showUserId = false }: PackagesTableProps) {
    const [selectedPackage, setSelectedPackage] = useState<PackageResponse | null>(null)
    const showBusinessFields = recipientType !== 'individual'
    const sortedPackages = useMemo(
        () => [...packages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [packages],
    )

    return (
        <>
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-base font-semibold text-gray-900">Lista coletelor</p>
                    <p className="mt-0.5 text-sm text-gray-500">{sortedPackages.length} înregistrări</p>
                </div>

                {sortedPackages.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">{emptyMessage}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    {['Denumire colet', 'Tracking', 'Persoană', 'Telefon', showUserId ? 'User' : null, 'Declarație', 'Status', 'Data', 'Acțiuni'].filter(Boolean).map(h => (
                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedPackages.map(packageItem => (
                                    <tr key={packageItem.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                                            {getPackageName(packageItem, recipientType)}
                                        </td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">
                                            {packageItem.trackingCode}
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                                            {getRecipientName(packageItem, recipientType)}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{packageItem.phoneNumber}</td>
                                        {showUserId ? (
                                            <td className="px-6 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                                                {packageItem.userId ? `#${packageItem.userId}` : '—'}
                                            </td>
                                        ) : null}
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getDeclarationBadgeClass(packageItem.hasDeclaration)}`}>
                                                {getDeclarationLabel(packageItem)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                                            {PACKAGE_STATUS_LABELS[packageItem.status] ?? `Status ${packageItem.status}`}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                                            {new Date(packageItem.createdAt).toLocaleDateString('ro-RO')}
                                        </td>
                                        <td className="px-6 py-3">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPackage(packageItem)}
                                                className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                            >
                                                Detalii
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedPackage ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
                            <div>
                                <p className="text-base font-semibold text-gray-900">{getPackageName(selectedPackage, recipientType)}</p>
                                <p className="mt-0.5 font-mono text-xs text-gray-500">{selectedPackage.trackingCode}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedPackage(null)}
                                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Închide
                            </button>
                        </div>

                        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                            <InfoRow label="Telefon" value={selectedPackage.phoneNumber} />
                            <InfoRow label="Adresă preluată" value={selectedPackage.locationAdress} />
                            <InfoRow label="Nume persoană" value={selectedPackage.fullName} />
                            {showBusinessFields ? <InfoRow label="Companie" value={selectedPackage.companyName} /> : null}
                            {showBusinessFields ? <InfoRow label="Persoană contact" value={selectedPackage.contactPerson} /> : null}
                            <InfoRow label="Status colet" value={PACKAGE_STATUS_LABELS[selectedPackage.status] ?? `Status ${selectedPackage.status}`} />
                            <InfoRow label="Declarație" value={getDeclarationLabel(selectedPackage)} />
                            <InfoRow label="Tip declarație" value={selectedPackage.declarationType} />
                            <InfoRow label="Produs declarat" value={selectedPackage.declarationProductName} />
                            <InfoRow label="Creat la" value={new Date(selectedPackage.createdAt).toLocaleString('ro-RO')} />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-1 break-words text-sm font-medium text-gray-900">{value || '—'}</p>
        </div>
    )
}
