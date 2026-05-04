export type CurrencyOption = 'USD($)' | 'EUR(€)' | 'MDL' | 'RON'

export type ProductDraft = {
    id: string
    trackingNumber: string
    senderName: string
    productName: string
    productUrl: string
    hsCode: string
    items: number | ''
    inTotal: number | ''
}

export type ProductField = Exclude<keyof ProductDraft, 'id'>

const CURRENCY_OPTIONS: CurrencyOption[] = ['USD($)', 'EUR(€)', 'MDL', 'RON']

type BusinessPopupDeclarationProps = {
    isOpen: boolean
    onClose: () => void
    currency: CurrencyOption
    onCurrencyChange: (value: CurrencyOption) => void
    products: ProductDraft[]
    onUpdateProduct: (productId: string, field: ProductField, value: string | number | '') => void
    onAddProduct: () => void
    onDeleteProduct: (productId: string) => void
    onResetProduct: (productId: string) => void
    popupError: string | null
    onSave: () => void
}

export default function BusinessPopupDeclaration({
    isOpen,
    onClose,
    currency,
    onCurrencyChange,
    products,
    onUpdateProduct,
    onAddProduct,
    onDeleteProduct,
    onResetProduct,
    popupError,
    onSave,
}: BusinessPopupDeclarationProps) {
    if (!isOpen) {
        return null
    }

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
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-extrabold tracking-wide">DECLARAȚIE VAMALĂ</h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="justify-self-end flex h-8 w-8 items-center justify-center rounded border border-white/70 text-white hover:bg-white/15"
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
                        <p>
                            <strong>Completați datele cu atenție.</strong> Informațiile furnizate vor fi utilizate în scopuri de control vamal.
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-400 bg-white p-4">
                        <p className="mb-3 text-sm font-bold text-slate-800">DATE GENERALE</p>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Moneda</label>
                        <select
                            value={currency}
                            onChange={(e) => onCurrencyChange(e.target.value as CurrencyOption)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm sm:max-w-xs"
                        >
                            {CURRENCY_OPTIONS.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {products.map((product, index) => (
                        <div key={product.id} className="space-y-4 rounded-lg border border-gray-400  p-4">
                            <p className="text-sm font-bold text-slate-800">
                                INFORMAȚII DESPRE PRODUS{products.length > 1 ? ` - PRODUS ${index + 1}` : ''}
                            </p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Denumirea produsului</label>
                                    <input
                                        value={product.productName}
                                        onChange={(e) => onUpdateProduct(product.id, 'productName', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                                        placeholder="Introduceți denumirea completă a produsului"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">URL produs</label>
                                    <input
                                        value={product.productUrl}
                                        onChange={(e) => onUpdateProduct(product.id, 'productUrl', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">HS code</label>
                                    <input
                                        value={product.hsCode}
                                        onChange={(e) => onUpdateProduct(product.id, 'hsCode', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                                        placeholder="Ex: 8471.30"
                                    />
                                </div>
                            </div>

                            <p className="pt-1 text-sm font-bold text-slate-800">INFORMAȚII DESPRE EXPEDIERE</p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Număr de urmărire (tracking)</label>
                                    <input
                                        value={product.trackingNumber}
                                        onChange={(e) => onUpdateProduct(product.id, 'trackingNumber', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                                        placeholder="Ex: 176-12345678"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Număr de articole</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={product.items}
                                        onChange={(e) => onUpdateProduct(product.id, 'items', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                                        placeholder="1"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Denumirea Expeditorului</label>
                                    <input
                                        value={product.senderName}
                                        onChange={(e) => onUpdateProduct(product.id, 'senderName', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                                        placeholder="Introduceți numele expeditorului"
                                    />
                                </div>
                            </div>

                            <p className="pt-1 text-sm font-bold text-slate-800">VALOAREA BUNURILOR</p>

                            <div className="space-y-3">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Valoarea totală declarată</label>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="grid w-full max-w-[520px] grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-gray-200 px-3 py-2">
                                        <input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={product.inTotal}
                                            onChange={(e) => onUpdateProduct(product.id, 'inTotal', e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full border-0 p-0 text-sm focus:outline-none"
                                            placeholder="0.00"
                                        />
                                        <span className="text-sm font-medium text-slate-500">{currency.includes('MDL') ? 'MDL' : currency}</span>
                                    </div>

                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onResetProduct(product.id)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            <img src="/images/Reset.svg" alt="Reset" className="h-4 w-4" />
                                            <span>Reset</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDeleteProduct(product.id)}
                                            disabled={products.length === 1}
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <img src="/images/Delete.svg" alt="Delete" className="h-4 w-4" />
                                            <span>Șterge</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

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
                        <img src="/images/Plus.svg" alt="Add product" className="h-4 w-4" />
                        <span>Adaugă încă un produs</span>
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                    >
                        <img src="/Save.svg" alt="Save" className="h-4 w-4" />
                        <span>Salvează declarația</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
