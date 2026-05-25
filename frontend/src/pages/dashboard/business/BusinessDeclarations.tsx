import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import type { Declaration } from '../../../types/declaration'
import { getSession } from '../../../auth/auth.session'
import { createBusinessDeclaration, getBusinessDeclarationsByUserId } from '../../../api/businessDeclarationsApi'
import type { BusinessDeclarationResponse } from '../../../api/types/businessDeclaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import BusinessPopupDeclaration, {
    type ProductDraft,
    type ProductField,
} from '../../../components/dashboard/BusinessPopupDeclaration'
import { PRODUCT_CATEGORIES, calculateTaxes, type ProductCategory } from '../../../components/dashboard/TaxBreakdown'
import { getMDLRates, toMDL } from '../../../utils/exchangeRates'
import type { InputCurrency } from '../../../utils/exchangeRates'

const createEmptyProduct = (): ProductDraft => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    trackingNumber: '',
    senderName: '',
    productName: '',
    productUrl: '',
    hsCode: '',
    items: '',
    inTotal: '',
    inputCurrency: 'MDL',
    category: PRODUCT_CATEGORIES[12],
})

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

const mapCurrencyEnumToLabel = (currency: number) => CURRENCY_LABEL_BY_ENUM[currency] ?? 'MDL'
const mapStatusEnumToLabel = (status: number) => STATUS_BY_ENUM[status] ?? 'Under Review'

const mapBusinessToDeclaration = (item: BusinessDeclarationResponse): Declaration => {
    const category = PRODUCT_CATEGORIES[item.category] ?? PRODUCT_CATEGORIES[12]
    const baseValue = Number(item.totalCost)
    const taxes = calculateTaxes(baseValue, category)
    return {
        id: String(item.id),
        user_id: String(item.userId),
        awb_number: item.trackingCode,
        hs_code: item.hsCode,
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
        sender_name: item.senderName,
        product_url: item.productURL,
        category_label: category.label,
    }
}

export default function BusinessDeclarations() {
    const session = getSession()
    const userId = session?.userId
        ? (parseInt(session.userId) || parseInt(session.userId.replace(/\D/g, '')) || null)
        : null

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [products, setProducts] = useState<ProductDraft[]>(() => [createEmptyProduct()])
    const [popupError, setPopupError] = useState<string | null>(null)
    const [businessDeclarations, setBusinessDeclarations] = useState<BusinessDeclarationResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const companyDeclarations = useMemo(
        () => businessDeclarations.map(mapBusinessToDeclaration),
        [businessDeclarations],
    )

    const loadDeclarations = useCallback(async () => {
        if (!userId) {
            setLoading(false)
            setError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        try {
            const response = await getBusinessDeclarationsByUserId(userId)
            setBusinessDeclarations(response ?? [])
            setError(null)
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                setError(err.response.data)
            } else {
                setError('Nu s-au putut încărca declarațiile.')
            }
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        loadDeclarations()
    }, [loadDeclarations])

    const handleOpenPopup = () => {
        setPopupError(null)
        setIsPopupOpen(true)
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false)
        setPopupError(null)
    }

    const handleUpdateProduct = (productId: string, field: ProductField, value: string | number | '' | ProductCategory | InputCurrency) => {
        setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, [field]: value } : product)))
    }

    const handleAddProduct = () => {
        setPopupError(null)
        setProducts((prev) => [...prev, createEmptyProduct()])
    }

    const handleDeleteProduct = (productId: string) => {
        setPopupError(null)
        setProducts((prev) => (prev.length > 1 ? prev.filter((product) => product.id !== productId) : prev))
    }

    const handleResetProduct = (productId: string) => {
        setProducts((prev) => prev.map((product) => (product.id === productId ? {
            ...product,
            trackingNumber: '',
            senderName: '',
            productName: '',
            productUrl: '',
            hsCode: '',
            items: '',
            inTotal: '',
            inputCurrency: 'MDL' as InputCurrency,
            category: PRODUCT_CATEGORIES[12],
        } : product)))
    }

    const handleSaveDeclaration = async () => {
        if (isSaving) return
        if (!userId) {
            setPopupError('Sesiune invalidă.')
            return
        }

        setIsSaving(true)
        setPopupError(null)

        const invalidProduct = products.find((product) => (
            !product.productName.trim()
            || !product.productUrl.trim()
            || !product.trackingNumber.trim()
            || !product.senderName.trim()
            || !product.hsCode.trim()
            || product.items === ''
            || product.items <= 0
            || product.inTotal === ''
            || product.inTotal < 0
        ))

        if (invalidProduct) {
            setPopupError('Completează toate câmpurile pentru fiecare produs.')
            setIsSaving(false)
            return
        }

        try {
            const rates = await getMDLRates()

            await Promise.all(products.map((product) => {
                const mdlValue = toMDL(Number(product.inTotal), product.inputCurrency, rates)
                return createBusinessDeclaration({
                    userId,
                    senderName: product.senderName.trim(),
                    productName: product.productName.trim(),
                    productURL: product.productUrl.trim(),
                    trackingCode: product.trackingNumber.trim(),
                    hsCode: product.hsCode.trim(),
                    quantity: Number(product.items),
                    totalCost: mdlValue,
                    currency: 2,
                    category: product.category.value,
                })
            }))

            await loadDeclarations()
            setProducts([createEmptyProduct()])
            setIsPopupOpen(false)
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                setPopupError(err.response.data)
            } else {
                setPopupError('Nu s-a putut salva declarația.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8">
            <BusinessVerificationBanner />

            <div className="space-y-4">
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarații companie</h1>
                <button
                    type="button"
                    onClick={handleOpenPopup}
                    className="flex w-full items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 transition-colors hover:bg-sky-100 sm:w-auto"
                >
                    <img src="/images/Declaration.svg" alt="Declaratie" className="h-6 w-6" />
                    <span>Adaugă o declarație</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total declarații" value={String(companyDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(companyDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(companyDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-400">
                    Se încarcă declarațiile...
                </div>
            ) : (
                <DeclarationsTable declarations={companyDeclarations} />
            )}

            <BusinessPopupDeclaration
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                products={products}
                onUpdateProduct={handleUpdateProduct}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onResetProduct={handleResetProduct}
                popupError={popupError}
                onSave={handleSaveDeclaration}
            />
        </div>
    )
}
