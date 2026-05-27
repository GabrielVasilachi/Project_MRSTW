import { useState, useEffect } from 'react'
import TaxBreakdown from './TaxBreakdown'
import { getMDLRates, toMDL, type InputCurrency } from '../../utils/exchangeRates'
import type { TaxCategory } from '../../api/types/taxCalculator'

export type { InputCurrency }

export type ProductDraft = {
    id: string
    packageId?: number | null
    trackingNumber: string
    productName: string
    productUrl: string
    items: number | ''
    inTotal: number | ''
    inputCurrency: InputCurrency
    category: TaxCategory
}

export type ProductField = Exclude<keyof ProductDraft, 'id'>

const INPUT_CURRENCIES: InputCurrency[] = ['MDL', 'USD', 'EUR', 'RON']

function getFieldError(field: string, value: string | number | ''): string | null {
    switch (field) {
        case 'productName':
            return !String(value).trim() ? 'Denumirea produsului este obligatorie.' : null
        case 'productUrl':
            return !String(value).trim() ? 'URL-ul produsului este obligatoriu.' : null
        case 'trackingNumber':
            return !String(value).trim() ? 'Numărul de tracking este obligatoriu.' : null
        case 'items':
            if (value === '' || value === undefined) return 'Numărul de articole este obligatoriu.'
            if (Number(value) <= 0) return 'Numărul de articole trebuie să fie mai mare decât 0.'
            if (!Number.isInteger(Number(value))) return 'Numărul de articole trebuie să fie un număr întreg.'
            return null
        case 'inTotal':
            if (value === '' || value === undefined) return 'Valoarea totală este obligatorie.'
            if (Number(value) < 0) return 'Valoarea totală nu poate fi negativă.'
            return null
        default:
            return null
    }
}

type IndividualPopupDeclarationProps = {
    isOpen: boolean
    onClose: () => void
    products: ProductDraft[]
    onUpdateProduct: (productId: string, field: ProductField, value: string | number | '' | TaxCategory | InputCurrency) => void
    onAddProduct: () => void
    onDeleteProduct: (productId: string) => void
    onResetProduct: (productId: string) => void
    popupError: string | null
    onSave: () => void
    productCategories: TaxCategory[]
}

const VALIDATED_FIELDS: ProductField[] = ['productName', 'productUrl', 'trackingNumber', 'items', 'inTotal']

export default function IndividualPopupDeclaration({
    isOpen,
    onClose,
    products,
    onUpdateProduct,
    onAddProduct,
    onDeleteProduct,
    onResetProduct,
    popupError,
    onSave,
    productCategories,
}: IndividualPopupDeclarationProps) {
    const [touched, setTouched] = useState<Set<string>>(new Set())
    const [rates, setRates] = useState<Record<string, number> | null>(null)

    useEffect(() => {
        if (!isOpen) return
        getMDLRates().then(setRates)
    }, [isOpen])

    const touch = (productId: string, field: string) => {
        setTouched(prev => new Set(prev).add(`${productId}-${field}`))
    }

    const isTouched = (productId: string, field: string) => touched.has(`${productId}-${field}`)

    const err = (productId: string, field: ProductField, value: string | number | '') => {
        if (!isTouched(productId, field)) return null
        return getFieldError(field, value)
    }

    const handleSave = () => {
        const all = new Set<string>()
        products.forEach(p => VALIDATED_FIELDS.forEach(f => all.add(`${p.id}-${f}`)))
        setTouched(all)
        onSave()
    }

    const inputClass = (hasError: boolean) =>
        `w-full rounded-md border px-3 py-2 text-sm ${hasError ? 'border-red-400 bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400' : 'border-gray-200'}`

    const FieldError = ({ msg }: { msg: string | null }) =>
        msg ? <p className="mt-1 text-xs text-red-500">{msg}</p> : null

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/45"
                aria-label="Inchide popup declaratie"
            />

            <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-sky-700 bg-blue-900 px-6 py-4 text-white">
                    <h2 className="text-xl font-extrabold tracking-wide">DECLARAȚIE VAMALĂ</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded border border-white/70 text-white hover:bg-white/15"
                        aria-label="Inchide"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[70vh] space-y-4 overflow-y-auto bg-slate-50 p-5">
                    <div className="flex items-start gap-2 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-700">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm0 4a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 12 6Zm1.5 12h-3v-1.5h.75v-4H10v-1.5h2.5v5.5h1Z" />
                        </svg>
                        <p><strong>Completați datele cu atenție.</strong> Informațiile furnizate vor fi utilizate în scopuri de control vamal.</p>
                    </div>

                    {products.map((product, index) => {
                        const eProductName = err(product.id, 'productName', product.productName)
                        const eProductUrl  = err(product.id, 'productUrl',  product.productUrl)
                        const eTracking    = err(product.id, 'trackingNumber', product.trackingNumber)
                        const eItems       = err(product.id, 'items',       product.items)
                        const eInTotal     = err(product.id, 'inTotal',     product.inTotal)
                        const isPackageLinked = product.packageId !== null && product.packageId !== undefined

                        const mdlValue = typeof product.inTotal === 'number' && product.inTotal > 0 && rates
                            ? toMDL(product.inTotal, product.inputCurrency, rates)
                            : null

                        return (
                            <div key={product.id} className="space-y-4 rounded-lg border border-gray-400 p-4">
                                <p className="text-sm font-bold text-slate-800">
                                    INFORMAȚII DESPRE PRODUS{products.length > 1 ? ` - PRODUS ${index + 1}` : ''}
                                </p>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Denumirea produsului</label>
                                        <input
                                            value={product.productName}
                                            onChange={(e) => onUpdateProduct(product.id, 'productName', e.target.value)}
                                            onBlur={() => touch(product.id, 'productName')}
                                            className={inputClass(!!eProductName)}
                                            placeholder="Introduceți denumirea completă a produsului"
                                        />
                                        <FieldError msg={eProductName} />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">URL produs</label>
                                        <input
                                            value={product.productUrl}
                                            onChange={(e) => onUpdateProduct(product.id, 'productUrl', e.target.value)}
                                            onBlur={() => touch(product.id, 'productUrl')}
                                            className={inputClass(!!eProductUrl)}
                                            placeholder="https://..."
                                        />
                                        <FieldError msg={eProductUrl} />
                                    </div>
                                </div>

                                <p className="pt-1 text-sm font-bold text-slate-800">INFORMAȚII DESPRE EXPEDIERE</p>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Număr de urmărire (tracking)</label>
                                        <input
                                            value={product.trackingNumber}
                                            readOnly={isPackageLinked}
                                            onChange={(e) => onUpdateProduct(product.id, 'trackingNumber', e.target.value)}
                                            onBlur={() => touch(product.id, 'trackingNumber')}
                                            className={`${inputClass(!!eTracking)} ${isPackageLinked ? 'bg-gray-100 text-gray-700' : ''}`}
                                            placeholder="Ex: 176-12345678"
                                        />
                                        <FieldError msg={eTracking} />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Număr de articole</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={product.items}
                                            onChange={(e) => onUpdateProduct(product.id, 'items', e.target.value === '' ? '' : Number(e.target.value))}
                                            onBlur={() => touch(product.id, 'items')}
                                            className={inputClass(!!eItems)}
                                            placeholder="1"
                                        />
                                        <FieldError msg={eItems} />
                                    </div>
                                </div>

                                <p className="pt-1 text-sm font-bold text-slate-800">CATEGORIA PRODUSULUI</p>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Selectați categoria</label>
                                    <div className="flex flex-wrap gap-2">
                                        {productCategories.map(cat => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => onUpdateProduct(product.id, 'category', cat)}
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                                                    product.category.value === cat.value
                                                        ? 'border-sky-600 bg-sky-600 text-white'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:text-sky-700'
                                                }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <p className="pt-1 text-sm font-bold text-slate-800">VALOAREA BUNURILOR</p>

                                <div className="space-y-3">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Valoarea totală declarată</label>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="w-full max-w-130">
                                            <div className={`grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border px-3 py-2 ${eInTotal ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={product.inTotal}
                                                    onChange={(e) => onUpdateProduct(product.id, 'inTotal', e.target.value === '' ? '' : Number(e.target.value))}
                                                    onBlur={() => touch(product.id, 'inTotal')}
                                                    className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none"
                                                    placeholder="0.00"
                                                />
                                                <select
                                                    value={product.inputCurrency}
                                                    onChange={(e) => onUpdateProduct(product.id, 'inputCurrency', e.target.value as InputCurrency)}
                                                    className="border-0 bg-transparent p-0 text-sm font-medium text-slate-500 focus:outline-none"
                                                >
                                                    {INPUT_CURRENCIES.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {product.inputCurrency !== 'MDL' && mdlValue !== null && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    ≈ {mdlValue.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MDL
                                                </p>
                                            )}
                                            <FieldError msg={eInTotal} />
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onResetProduct(product.id)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                            >
                                                <img src="/images/Reset.svg" alt="Resetează" className="h-4 w-4" />
                                                <span>Resetează</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteProduct(product.id)}
                                                disabled={products.length === 1}
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <img src="/images/Delete.svg" alt="Șterge" className="h-4 w-4" />
                                                <span>Șterge</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <TaxBreakdown
                                    baseValue={rates && typeof product.inTotal === 'number'
                                        ? toMDL(product.inTotal, product.inputCurrency, rates)
                                        : typeof product.inTotal === 'number' ? product.inTotal : 0}
                                    category={product.category}
                                    currency="MDL"
                                />
                            </div>
                        )
                    })}

                    {popupError ? (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {popupError}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onAddProduct}
                        className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50"
                    >
                        <img src="/images/Plus.svg" alt="Adaugă produs" className="h-4 w-4" />
                        <span>Adaugă încă un produs</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                    >
                        <img src="/Save.svg" alt="Salvează" className="h-4 w-4" />
                        <span>Salvează declarația</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
