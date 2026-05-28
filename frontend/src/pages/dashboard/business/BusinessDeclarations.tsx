import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import type { Declaration } from '../../../types/declaration'
import { getSession } from '../../../auth/auth.session'
import { createBusinessDeclaration, deleteBusinessDeclaration, getBusinessDeclarationsByUserId, updateBusinessDeclaration } from '../../../api/businessDeclarationsApi'
import type { BusinessDeclarationResponse } from '../../../api/types/businessDeclaration'
import { getBusinessProfileByUserId } from '../../../api/profilesApi'
import { getPackagesByUserId } from '../../../api/packagesApi'
import type { PackageResponse } from '../../../api/types/package'
import KpiCard from '../../../components/dashboard/KpiCard'
import { fmt } from '../../../utils/format'
import DeclarationsTable from '../../../components/dashboard/DeclarationsTable'
import type { DeclarationEditValues } from '../../../components/dashboard/DeclarationsTable'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import BusinessPopupDeclaration, {
    type ProductDraft,
    type ProductField,
} from '../../../components/dashboard/BusinessPopupDeclaration'
import { calculateTaxes as calculateTaxesApi, getTaxCategories } from '../../../api/taxCalculatorApi'
import type { TaxCalculationResult, TaxCategory } from '../../../api/types/taxCalculator'
import { getMDLRates, toMDL } from '../../../utils/exchangeRates'
import type { InputCurrency } from '../../../utils/exchangeRates'
import { hasMissingBusinessProfileData } from '../../../utils/profileValidation'

const createProductId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`
const DEFAULT_CATEGORY: TaxCategory = { value: 12, label: '' }

const createEmptyProduct = (category: TaxCategory = DEFAULT_CATEGORY): ProductDraft => ({
    id: createProductId(),
    packageId: null,
    trackingNumber: '',
    senderName: '',
    productName: '',
    productUrl: '',
    hsCode: '',
    items: '',
    inTotal: '',
    inputCurrency: 'MDL',
    category,
})

const createProductFromPackage = (packageItem: PackageResponse, category: TaxCategory): ProductDraft => ({
    ...createEmptyProduct(category),
    packageId: packageItem.id,
    trackingNumber: packageItem.trackingCode,
})

const createProductsFromPackages = (packages: PackageResponse[], category: TaxCategory): ProductDraft[] => (
    packages.length > 0 ? packages.map((packageItem) => createProductFromPackage(packageItem, category)) : [createEmptyProduct(category)]
)

const getPackageOwnerLabel = (packageItem: PackageResponse) => (
    packageItem.companyName
    || packageItem.fullName
    || packageItem.contactPerson
    || packageItem.locationAdress
)

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

const mapBusinessToDeclaration = (
    item: BusinessDeclarationResponse,
    taxCalculation: TaxCalculationResult | undefined,
    category: TaxCategory | undefined,
): Declaration => {
    const baseValue = Number(item.totalCost)
    return {
        id: String(item.id),
        declaration_type: 'legal',
        user_id: String(item.userId),
        package_id: item.packageId ?? null,
        awb_number: item.trackingCode,
        hs_code: item.hsCode,
        description: item.productName,
        quantity: item.quantity,
        gross_weight: 0,
        customs_value: baseValue,
        currency: mapCurrencyEnumToLabel(item.currency),
        currency_value: item.currency,
        category: item.category,
        vat: taxCalculation?.vat ?? 0,
        customs_duty: taxCalculation?.customsDuty ?? 0,
        excise: taxCalculation?.excise ?? 0,
        total_taxes: taxCalculation?.totalAmount ?? 0,
        status: mapStatusEnumToLabel(item.status),
        status_value: item.status,
        sender_name: item.senderName,
        product_url: item.productURL,
        category_label: category?.label ?? taxCalculation?.categoryName,
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
    const [taxCalculationsByDeclarationId, setTaxCalculationsByDeclarationId] = useState<Record<number, TaxCalculationResult>>({})
    const [productCategories, setProductCategories] = useState<TaxCategory[]>([])
    const [userPackages, setUserPackages] = useState<PackageResponse[]>([])
    const [packagesLoading, setPackagesLoading] = useState(true)
    const [packagesError, setPackagesError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [needsVerification, setNeedsVerification] = useState(false)

    const defaultCategory = useMemo(
        () => productCategories.find((category) => category.value === 12) ?? productCategories[0] ?? DEFAULT_CATEGORY,
        [productCategories],
    )

    const categoryByValue = useMemo(
        () => Object.fromEntries(productCategories.map((category) => [category.value, category])),
        [productCategories],
    )

    const companyDeclarations = useMemo(
        () => businessDeclarations.map((item) => mapBusinessToDeclaration(
            item,
            taxCalculationsByDeclarationId[item.id],
            categoryByValue[item.category],
        )),
        [businessDeclarations, taxCalculationsByDeclarationId, categoryByValue],
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
            const taxCalculationEntries = await Promise.all((response ?? []).map(async (item) => {
                const taxCalculation = await calculateTaxesApi({
                    baseValue: Number(item.totalCost),
                    category: item.category,
                })

                return [item.id, taxCalculation] as const
            }))
            setTaxCalculationsByDeclarationId(Object.fromEntries(taxCalculationEntries))
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

    const loadCategories = useCallback(async () => {
        try {
            const response = await getTaxCategories()
            setProductCategories(response ?? [])
        } catch {
            setProductCategories([])
        }
    }, [])

    const loadPackages = useCallback(async () => {
        if (!userId) {
            setPackagesLoading(false)
            setPackagesError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        try {
            const response = await getPackagesByUserId(userId)
            setUserPackages(response ?? [])
            setPackagesError(null)
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                setPackagesError(err.response.data)
            } else {
                setPackagesError('Nu s-au putut încărca coletele.')
            }
        } finally {
            setPackagesLoading(false)
        }
    }, [userId])

    useEffect(() => {
        loadDeclarations()
    }, [loadDeclarations])

    useEffect(() => {
        loadPackages()
    }, [loadPackages])

    useEffect(() => {
        loadCategories()
    }, [loadCategories])

    useEffect(() => {
        if (!userId) {
            setNeedsVerification(false)
            return
        }

        let ignore = false

        async function loadProfileStatus() {
            try {
                const profile = await getBusinessProfileByUserId(userId!)

                if (!ignore) {
                    setNeedsVerification(hasMissingBusinessProfileData(profile))
                }
            } catch {
                if (!ignore) {
                    setNeedsVerification(false)
                }
            }
        }

        loadProfileStatus()

        return () => {
            ignore = true
        }
    }, [userId])

    const handleOpenPopup = () => {
        setPopupError(null)
        setProducts(createProductsFromPackages(userPackages, defaultCategory))
        setIsPopupOpen(true)
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false)
        setPopupError(null)
    }

    const handleUpdateProduct = (productId: string, field: ProductField, value: string | number | '' | TaxCategory | InputCurrency) => {
        setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, [field]: value } : product)))
    }

    const handleAddProduct = () => {
        setPopupError(null)
        setProducts((prev) => [...prev, createEmptyProduct(defaultCategory)])
    }

    const handleDeleteProduct = (productId: string) => {
        setPopupError(null)
        setProducts((prev) => (prev.length > 1 ? prev.filter((product) => product.id !== productId) : prev))
    }

    const handleResetProduct = (productId: string) => {
        setProducts((prev) => prev.map((product) => (product.id === productId ? {
            ...product,
            trackingNumber: product.packageId ? product.trackingNumber : '',
            senderName: '',
            productName: '',
            productUrl: '',
            hsCode: '',
            items: '',
            inTotal: '',
            inputCurrency: 'MDL' as InputCurrency,
            category: defaultCategory,
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
                    packageId: product.packageId ?? null,
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
            setProducts([createEmptyProduct(defaultCategory)])
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

    const handleDeleteDeclaration = async (declaration: Declaration) => {
        await deleteBusinessDeclaration(Number(declaration.id))
        await loadDeclarations()
    }

    const handleUpdateDeclaration = async (declaration: Declaration, values: DeclarationEditValues) => {
        await updateBusinessDeclaration(Number(declaration.id), {
            packageId: declaration.package_id ?? null,
            senderName: values.senderName.trim(),
            productName: values.productName.trim(),
            productURL: values.productURL.trim(),
            trackingCode: values.trackingCode.trim(),
            hsCode: values.hsCode.trim(),
            quantity: values.quantity,
            totalCost: values.totalCost,
            currency: values.currency,
            category: values.category,
            status: declaration.status_value ?? 0,
        })
        await loadDeclarations()
    }

    return (
        <div className="space-y-8">
            {needsVerification ? <BusinessVerificationBanner /> : null}

            <div className="space-y-4">
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Declarații companie</h1>
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-base font-semibold text-gray-900">Colete asociate</p>
                        <p className="text-sm text-gray-500">{userPackages.length} colete</p>
                    </div>

                    {packagesLoading ? (
                        <p className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                            Se încarcă coletele...
                        </p>
                    ) : packagesError ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {packagesError}
                        </p>
                    ) : userPackages.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {userPackages.map((packageItem) => (
                                <div key={packageItem.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                    <p className="font-mono text-sm font-semibold text-gray-900">{packageItem.trackingCode}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                        <span>{getPackageOwnerLabel(packageItem)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                            Nu există colete asociate contului.
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleOpenPopup}
                        disabled={packagesLoading}
                        className="mt-4 flex w-full items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 transition-colors hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        <img src="/images/Declaration.svg" alt="Declaratie" className="h-6 w-6" />
                        <span>Adaugă o declarație</span>
                    </button>
                </div>
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
                <DeclarationsTable
                    declarations={companyDeclarations}
                    onDeleteDeclaration={handleDeleteDeclaration}
                    onUpdateDeclaration={handleUpdateDeclaration}
                    productCategories={productCategories}
                />
            )}

            {isPopupOpen ? (
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
                    productCategories={productCategories}
                />
            ) : null}
        </div>
    )
}
