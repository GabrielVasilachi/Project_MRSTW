import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import type { Declaration } from '../../../types/declaration'
import { getAdminDeclarations, openAdminDeclaration } from '../../../api/adminDeclarationsApi'
import type { AdminDeclarationResponse, AdminDeclarationsFilter } from '../../../api/types/adminDeclaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import { PRODUCT_CATEGORIES, calculateTaxes } from '../../../components/dashboard/TaxBreakdown'

const PERSON_FILTERS: { value: AdminDeclarationsFilter; label: string }[] = [
    { value: 'all', label: 'Toate declarațiile' },
    { value: 'physical', label: 'Declarații Persoană Fizică' },
    { value: 'legal', label: 'Declarații Persoană Juridică' },
]

const CURRENCY_LABEL_BY_ENUM: Record<number, string> = {
    0: 'EUR',
    1: 'USD',
    2: 'MDL',
    3: 'RON',
}

const STATUS_BY_ENUM: Record<number, string> = {
    0: 'Under Review',
    1: 'Approved',
    2: 'Rejected',
    3: 'Pending Documents',
}

const PERSON_TYPE_LABELS: Record<string, string> = {
    individual: 'Persoană Fizică',
    business: 'Persoană Juridică',
}

const mapCurrencyEnumToLabel = (currency: number) => CURRENCY_LABEL_BY_ENUM[currency] ?? 'MDL'
const mapStatusEnumToLabel = (status: number) => STATUS_BY_ENUM[status] ?? 'Under Review'

const mapAdminToDeclaration = (item: AdminDeclarationResponse): Declaration => {
    const category = PRODUCT_CATEGORIES[item.category] ?? PRODUCT_CATEGORIES[12]
    const baseValue = Number(item.totalCost)
    const taxes = calculateTaxes(baseValue, category)

    return {
        id: String(item.id),
        user_id: String(item.userId),
        awb_number: item.trackingCode,
        hs_code: item.hsCode ?? 'N/A',
        description: item.productName,
        quantity: item.quantity,
        gross_weight: 0,
        customs_value: baseValue,
        currency: mapCurrencyEnumToLabel(item.currency),
        vat: taxes.vat,
        customs_duty: taxes.customsDuty,
        excise: taxes.excise,
        total_taxes: taxes.totalAmount,
        status: mapStatusEnumToLabel(item.status),
        sender_name: item.senderName ?? undefined,
        product_url: item.productURL,
        category_label: category.label,
    }
}

function getApiErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 || error.response?.status === 405) {
            return 'Endpointul GET /admin-declarations nu este disponibil în backend-ul curent.'
        }

        if (typeof error.response?.data === 'string') {
            return error.response.data
        }
    }

    return 'Nu s-au putut încărca declarațiile.'
}

export default function AdminDeclarations() {
    const [filter, setFilter] = useState<AdminDeclarationsFilter>('all')
    const [adminDeclarations, setAdminDeclarations] = useState<AdminDeclarationResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadDeclarations = useCallback(async () => {
        setLoading(true)

        try {
            const response = await getAdminDeclarations(filter)
            setAdminDeclarations(response ?? [])
            setError(null)
        } catch (err: unknown) {
            setError(getApiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }, [filter])

    useEffect(() => {
        loadDeclarations()
    }, [loadDeclarations])

    const declarations = useMemo(
        () => adminDeclarations.map(mapAdminToDeclaration),
        [adminDeclarations],
    )

    const userLookup = useMemo(() => {
        const map = new Map<string, { name: string; type: string }>()

        adminDeclarations.forEach((declaration) => {
            map.set(String(declaration.userId), {
                name: declaration.user.fullName,
                type: PERSON_TYPE_LABELS[declaration.personType] ?? declaration.personType,
            })
        })

        return map
    }, [adminDeclarations])

    const adminById = useMemo(() => {
        return new Map(adminDeclarations.map(declaration => [String(declaration.id), declaration]))
    }, [adminDeclarations])

    const resolveUser = useCallback((userId: string) => userLookup.get(userId), [userLookup])

    const handleOpenDeclaration = useCallback(async (declaration: Declaration) => {
        const adminItem = adminById.get(declaration.id)

        if (!adminItem) {
            return
        }

        await openAdminDeclaration(adminItem.id, {
            action: 'open',
            declarationType: adminItem.declarationType,
        })
    }, [adminById])

    const pending = declarations.filter(d => d.status === 'Pending Documents').length
    const underReview = declarations.filter(d => d.status === 'Under Review').length
    const approved = declarations.filter(d => d.status === 'Approved').length
    const rejected = declarations.filter(d => d.status === 'Rejected').length

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarații vamale</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Declarațiile utilizatorilor sunt centralizate pentru revizuire și validare.
                </p>
            </div>

            {error ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total declarații" value={String(declarations.length)} />
                <KpiCard label="Aprobate" value={String(approved)} />
                <KpiCard label="În procesare" value={String(underReview + pending)} />
                <KpiCard label="Respinse" value={String(rejected)} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div>
                        <p className="text-base font-semibold text-gray-900">Filtrare după tip</p>
                        <p className="mt-0.5 text-sm text-gray-500">Alegeți tipul de declarație afișat.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {PERSON_FILTERS.map(item => (
                            <button
                                key={item.value}
                                onClick={() => setFilter(item.value)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    filter === item.value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-400">
                    Se încarcă declarațiile...
                </div>
            ) : (
                <DeclarationsTable
                    declarations={declarations}
                    resolveUser={resolveUser}
                    onOpenDeclaration={handleOpenDeclaration}
                />
            )}
        </div>
    )
}
