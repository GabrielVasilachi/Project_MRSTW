import { useEffect, useState } from 'react'
import axios from 'axios'
import { getPhysicalProfileByUserId } from '../../api/profilesApi'
import type { PhysicalProfileResponse } from '../../api/types/profile'
import { getSession } from '../../auth/auth.session'
import type { Declaration } from '../../types/declaration'
import KpiCard from '../../components/dashboard/KpiCard'
import { fmt } from '../../utils/format'
import DeclarationsTable from '../../components/dashboard/DeclarationsTable'
import AccountVerificationBanner from '../../components/dashboard/AccountVerificationBanner'
import ProfileInfoRow from '../../components/dashboard/ProfileInfoRow'
import { hasMissingPhysicalProfileData } from '../../utils/profileValidation'

export default function DashboardIndividual() {
    const session = getSession()
    const parsedUserId = session?.userId ? Number(session.userId) : null
    const userId = parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : null
    const [profile, setProfile] = useState<PhysicalProfileResponse | null>(null)
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
                const response = await getPhysicalProfileByUserId(currentUserId)

                if (!ignore) {
                    setProfile(response)
                    setError(null)
                }
            } catch (err: unknown) {
                if (!ignore) {
                    if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                        setError(err.response.data)
                    } else {
                        setError('Nu s-a putut încărca profilul fizic.')
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
                {error ?? 'Profilul fizic nu a fost găsit.'}
            </div>
        )
    }

    const userDeclarations: Declaration[] = []
    const needsVerification = hasMissingPhysicalProfileData(profile)
    const fields: [string, string | null | undefined, boolean][] = [
        ['IDNP', profile.idnp, true],
        ['Email', profile.email, true],
        ['Telefon', profile.phoneNumber, true],
        ['Adresă', profile.locationAddress, true],
    ]

    return (
        <div className="space-y-6">
            {needsVerification ? <AccountVerificationBanner /> : null}

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>{profile.fullName}</h1>
                <p className="mt-1 text-sm text-gray-500">Persoană fizică · {profile.email ?? 'email necompletat'}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date personale</p>
                {fields.map(([label, value, isRequired]) => (
                    <ProfileInfoRow key={label} label={label} value={value} required={isRequired} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard label="Declarații" value={String(userDeclarations.length)} />
                <KpiCard label="Valoare vamală totală" value={fmt(userDeclarations.reduce((s, d) => s + d.customs_value, 0))} />
                <KpiCard label="Taxe totale" value={fmt(userDeclarations.reduce((s, d) => s + d.total_taxes, 0))} />
            </div>

            <DeclarationsTable declarations={userDeclarations} />
        </div>
    )
}
