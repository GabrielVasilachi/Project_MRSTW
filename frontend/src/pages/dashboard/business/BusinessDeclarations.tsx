import { useState } from 'react'
import type { Declaration } from '../../../types/declaration'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import BusinessPopupDeclaration, {
    type CurrencyOption,
    type ProductDraft,
    type ProductField,
} from '../../../components/dashboard/BusinessPopupDeclaration'

const createEmptyProduct = (): ProductDraft => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    trackingNumber: '',
    senderName: '',
    productName: '',
    productUrl: '',
    hsCode: '',
    items: '',
    inTotal: '',
})

export default function BusinessDeclarations() {
    const companyDeclarations: Declaration[] = []
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [currency, setCurrency] = useState<CurrencyOption>('USD($)')
    const [products, setProducts] = useState<ProductDraft[]>(() => [createEmptyProduct()])
    const [popupError, setPopupError] = useState<string | null>(null)

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
            senderName: '',
            productName: '',
            productUrl: '',
            hsCode: '',
            items: '',
            inTotal: '',
        } : product)))
    }

    const handleSaveDeclaration = () => {
        setPopupError(null)
        setIsPopupOpen(false)
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

            <DeclarationsTable declarations={companyDeclarations} />

            <BusinessPopupDeclaration
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
