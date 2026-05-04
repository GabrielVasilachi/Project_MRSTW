import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import type { Declaration } from '../../../types/declaration'
import { getSession } from '../../../auth/auth.session'
import { createPhysicalDeclaration, getPhysicalDeclarationsByUserId } from '../../../api/physicalDeclarationsApi'
import type { PhysicalDeclarationResponse } from '../../../api/types/physicalDeclaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import AccountVerificationBanner from '../../../components/dashboard/AccountVerificationBanner'
import IndividualPopupDeclaration, {
    type CurrencyOption,
    type ProductDraft,
    type ProductField,
} from '../../../components/dashboard/IndividualPopupDeclaration'

const createEmptyProduct = (): ProductDraft => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    trackingNumber: '',
    productName: '',
    productUrl: '',
    items: '',
    inTotal: '',
})

const CURRENCY_ENUM_BY_OPTION: Record<CurrencyOption, number> = {
    'EUR(€)': 0,
    'USD($)': 1,
    'MDL': 2,
    'RON': 3,
}

const CURRENCY_LABEL_BY_ENUM: Record<number, string> = {
    0: 'EUR',
    1: 'USD',
    2: 'MDL',
    3: 'RON',
}

const mapCurrencyOptionToEnum = (currency: CurrencyOption) => CURRENCY_ENUM_BY_OPTION[currency] ?? 0

const mapCurrencyEnumToLabel = (currency: number) => CURRENCY_LABEL_BY_ENUM[currency] ?? 'EUR'

const mapPhysicalToDeclaration = (item: PhysicalDeclarationResponse): Declaration => ({
    id: String(item.id),
    user_id: String(item.userId),
    awb_number: item.trackingCode,
    hs_code: 'N/A',
    description: item.productName,
    quantity: item.quantity,
    gross_weight: 0,
    customs_value: Number(item.totalCost),
    currency: mapCurrencyEnumToLabel(item.currency),
    vat: 0,
    customs_duty: 0,
    excise: 0,
    total_taxes: 0,
    status: 'Under Review',
})

export default function IndividualDeclarations() {
    const session = getSession()
    const userId = session?.userId
        ? (parseInt(session.userId) || parseInt(session.userId.replace(/\D/g, '')) || null)
        : null

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [currency, setCurrency] = useState<CurrencyOption>('USD($)')
    const [products, setProducts] = useState<ProductDraft[]>(() => [createEmptyProduct()])
    const [popupError, setPopupError] = useState<string | null>(null)
    const [physicalDeclarations, setPhysicalDeclarations] = useState<PhysicalDeclarationResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const userDeclarations = useMemo(
        () => physicalDeclarations.map(mapPhysicalToDeclaration),
        [physicalDeclarations],
    )

    const loadDeclarations = useCallback(async () => {
        if (!userId) {
            setLoading(false)
            setError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        try {
            const response = await getPhysicalDeclarationsByUserId(userId)
            setPhysicalDeclarations(response ?? [])
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

    const handleUpdateProduct = (productId: string, field: ProductField, value: string | number | '') => {
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
            productName: '',
            productUrl: '',
            items: '',
            inTotal: '',
        } : product)))
    }

    const handleSaveDeclaration = async () => {
        if (isSaving) {
            return
        }

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
            const currencyEnum = mapCurrencyOptionToEnum(currency)

            await Promise.all(products.map((product) => createPhysicalDeclaration({
                userId,
                productName: product.productName.trim(),
                productURL: product.productUrl.trim(),
                trackingCode: product.trackingNumber.trim(),
                quantity: Number(product.items),
                totalCost: Number(product.inTotal),
                currency: currencyEnum,
            })))

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
            <AccountVerificationBanner />

            <div className="space-y-4">
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarațiile mele</h1>

               
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
                <KpiCard label="Total declarații" value={String(userDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(userDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(userDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
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
                <DeclarationsTable declarations={userDeclarations} />
            )}

            <IndividualPopupDeclaration
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                currency={currency}
                onCurrencyChange={setCurrency}
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
