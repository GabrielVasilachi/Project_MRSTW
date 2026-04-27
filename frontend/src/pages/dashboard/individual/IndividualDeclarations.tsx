import { useEffect, useState } from 'react'
import physicalData from '../../../_mock/mock_persoana_fizica.json'
import { getSession } from '../../../auth/auth.session'
import type { Declaration } from '../../../types/declaration'
import type { PhysicalUser } from '../../../types/user'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import AccountVerificationBanner from '../../../components/dashboard/AccountVerificationBanner'
import IndividualPopupDeclaration, {
    type CurrencyOption,
    type ProductDraft,
    type ProductField,
} from './IndividualPopupDeclaration'

function createProductDraft(): ProductDraft {
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        trackingNumber: '',
        productName: '',
        productUrl: '',
        items: '',
        inTotal: '',
    }
}

function roundToTwo(value: number): number {
    return Math.round(value * 100) / 100
}

export default function IndividualDeclarations() {
    const users = physicalData.users as PhysicalUser[]
    const declarations = physicalData.declarations as Declaration[]

    const session = getSession()
    const user = users.find(u => u.id === session?.userId) ?? users[0]
    const [userDeclarations, setUserDeclarations] = useState<Declaration[]>([])
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const [currency, setCurrency] = useState<CurrencyOption>('MDL')
    const [products, setProducts] = useState<ProductDraft[]>([createProductDraft()])
    const [popupError, setPopupError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            setUserDeclarations([])
            return
        }

        setUserDeclarations(declarations.filter(d => d.user_id === user.id))
    }, [declarations, user])

    if (!user) return null

    const resetPopupForm = () => {
        setCurrency('MDL')
        setProducts([createProductDraft()])
        setPopupError(null)
    }

    const openCreatePopup = () => {
        resetPopupForm()
        setIsCreatePopupOpen(true)
    }

    const closeCreatePopup = () => {
        setIsCreatePopupOpen(false)
        resetPopupForm()
    }

    const updateProduct = (productId: string, field: ProductField, value: string | number | '') => {
        setProducts(prev => prev.map(product => {
            if (product.id !== productId) {
                return product
            }

            return {
                ...product,
                [field]: value,
            }
        }))
    }

    const addProduct = () => {
        setProducts(prev => [...prev, createProductDraft()])
    }

    const deleteProduct = (productId: string) => {
        setProducts(prev => {
            if (prev.length === 1) {
                return prev
            }

            return prev.filter(product => product.id !== productId)
        })
        setPopupError(null)
    }

    const resetProduct = (productId: string) => {
        setProducts(prev => {
            return prev.map(product => ({
                ...product,
                trackingNumber: product.id === productId ? '' : product.trackingNumber,
                productName: product.id === productId ? '' : product.productName,
                productUrl: product.id === productId ? '' : product.productUrl,
                items: product.id === productId ? '' : product.items,
                inTotal: product.id === productId ? '' : product.inTotal,
            }))
        })
        setPopupError(null)
    }

    const saveDeclaration = () => {
        for (const product of products) {
            if (
                product.trackingNumber.trim() === '' ||
                product.productName.trim() === '' ||
                product.productUrl.trim() === '' ||
                product.items === '' ||
                product.inTotal === ''
            ) {
                setPopupError('Completează toate câmpurile pentru fiecare produs înainte de salvare.')
                return
            }

            if (Number(product.items) <= 0 || Number(product.inTotal) <= 0) {
                setPopupError('Items și In total trebuie să fie mai mari decât 0.')
                return
            }
        }

        const timestamp = Date.now()
        const newDeclarations: Declaration[] = products.map((product, index) => {
            const items = Number(product.items)
            const inTotal = roundToTwo(Number(product.inTotal))
            const vat = roundToTwo(inTotal * 0.2)
            const customsDuty = roundToTwo(inTotal * 0.05)
            const totalTaxes = roundToTwo(vat + customsDuty)

            return {
                id: `pd-local-${timestamp}-${index}`,
                user_id: user.id,
                awb_number: product.trackingNumber.trim(),
                hs_code: '0000000000',
                description: product.productName.trim(),
                quantity: items,
                gross_weight: roundToTwo(Math.max(1, items * 0.5)),
                customs_value: inTotal,
                currency,
                vat,
                customs_duty: customsDuty,
                excise: 0,
                total_taxes: totalTaxes,
                status: 'Pending Documents',
            }
        })

        setUserDeclarations(prev => [...newDeclarations, ...prev])
        closeCreatePopup()
    }

    return (
        <div className="space-y-8">
            <AccountVerificationBanner />

            <div>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarațiile mele</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Vizualizează toate declarațiile create și accesează detaliile fiecăreia.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreatePopup}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50"
                    aria-label="Adaugă o declarație"
                    title="Adaugă o declarație"
                >
                    <img src="/images/Declaration.svg" alt="Declaration" className="h-10 w-10" />
                    <span>Adaugă o declarație</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Total declarații" value={String(userDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(userDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(userDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
            </div>

            <DeclarationsTable declarations={userDeclarations} />

            <IndividualPopupDeclaration
                isOpen={isCreatePopupOpen}
                onClose={closeCreatePopup}
                currency={currency}
                onCurrencyChange={setCurrency}
                products={products}
                onUpdateProduct={updateProduct}
                onAddProduct={addProduct}
                onDeleteProduct={deleteProduct}
                onResetProduct={resetProduct}
                popupError={popupError}
                onSave={saveDeclaration}
            />
        </div>
    )
}
