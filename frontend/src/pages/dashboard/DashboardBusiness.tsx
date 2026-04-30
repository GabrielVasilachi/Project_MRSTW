import { useEffect, useState } from 'react'
import axios from 'axios'
import { getBusinessProfileByUserId } from '../../api/profilesApi'
import type { BusinessProfileResponse } from '../../api/types/profile'
import { getSession } from '../../auth/auth.session'
import type { Declaration } from '../../types/declaration'
import KpiCard from '../../components/dashboard/KpiCard'
import { fmt } from '../../utils/format'
import DeclarationsTable from '../../components/dashboard/DeclarationsTable'
import BusinessVerificationBanner from '../../components/dashboard/BusinessVerificationBanner'
import ProfileInfoRow from '../../components/dashboard/ProfileInfoRow'
import { hasMissingBusinessProfileData } from '../../utils/profileValidation'

export default function DashboardBusiness() {
    const session = getSession()
    const userId = session?.userId ? Number(session.userId) : null
    const [profile, setProfile] = useState<BusinessProfileResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            setError('Sesiunea nu conține id-ul utilizatorului.')
            return
        }

        const currentUserId = userId
        let ignore = false

        async function loadProfile() {
            try {
                const response = await getBusinessProfileByUserId(currentUserId)

                if (!ignore) {
                    setProfile(response)
                    setError(null)
                }
            } catch (err: unknown) {
                if (!ignore) {
                    if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                        setError(err.response.data)
                    } else {
                        setError('Nu s-a putut încărca profilul business.')
                    }
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        loadProfile()

        return () => {
            ignore = true
        }
    }, [userId])

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă profilul...
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error ?? 'Profilul business nu a fost găsit.'}
            </div>
        )
    }

    const companyDeclarations: Declaration[] = []
    const needsVerification = hasMissingBusinessProfileData(profile)
    const fields: [string, string | null | undefined, boolean][] = [
        ['Companie', profile.companyName, true],
        ['IDNO', profile.idnoCode, false],
        ['EORI', profile.eoriCode, true],
        ['Email', profile.email, true],
        ['Telefon', profile.phoneNumber, true],
        ['Adresă', profile.locationAdress, false],
        ['Cod TVA', profile.tvaCode, false],
        ['Persoană contact', profile.contactPerson, false],
        ['Persoană responsabilă', profile.responsiblePerson, false],
    ]

    return (
        <div className="space-y-6">
            {needsVerification ? <BusinessVerificationBanner /> : null}

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>{profile.companyName}</h1>
                <p className="mt-1 text-sm text-gray-500">Persoană juridică · {profile.email ?? 'email necompletat'}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date companie</p>
                {fields.map(([label, value, isRequired]) => (
                    <ProfileInfoRow key={label} label={label} value={value} required={isRequired} labelClassName="w-40" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Declarații" value={String(companyDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(companyDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(companyDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
            </div>

            <DeclarationsTable declarations={companyDeclarations} />
        </div>
    )
}
