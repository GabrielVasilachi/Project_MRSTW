import { useEffect, useState } from 'react'
import axios from 'axios'
import { getBusinessProfileByUserId, updateBusinessProfile } from '../../../api/profilesApi'
import type { BusinessProfileResponse } from '../../../api/types/profile'
import { getSession, setSession } from '../../../auth/auth.session'
import BusinessVerificationBanner from '../../../components/dashboard/BusinessVerificationBanner'
import ProfileInfoRow from '../../../components/dashboard/ProfileInfoRow'
import { hasMissingBusinessProfileData, isMissingProfileValue } from '../../../utils/profileValidation'

type EditValues = {
    companyName: string
    phoneNumber: string
    idnoCode: string
    locationAdress: string
    tvaCode: string
    email: string
    contactPerson: string
    responsiblePerson: string
    eoriCode: string
}

function toEditValues(profile: BusinessProfileResponse): EditValues {
    return {
        companyName: profile.companyName,
        phoneNumber: profile.phoneNumber,
        idnoCode: profile.idnoCode ?? '',
        locationAdress: profile.locationAdress ?? '',
        tvaCode: profile.tvaCode ?? '',
        email: profile.email ?? '',
        contactPerson: profile.contactPerson ?? '',
        responsiblePerson: profile.responsiblePerson ?? '',
        eoriCode: profile.eoriCode ?? '',
    }
}

export default function BusinessSettings() {
    const session = getSession()
    const parsedUserId = session?.userId ? Number(session.userId) : null
    const userId = parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : null
    const [profile, setProfile] = useState<BusinessProfileResponse | null>(null)
    const [editValues, setEditValues] = useState<EditValues>({
        companyName: '',
        phoneNumber: '',
        idnoCode: '',
        locationAdress: '',
        tvaCode: '',
        email: '',
        contactPerson: '',
        responsiblePerson: '',
        eoriCode: '',
    })
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
                    setEditValues(toEditValues(response))
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

    async function handleSave() {
        if (!userId || !profile) {
            return
        }

        const companyName = editValues.companyName.trim()
        const phoneNumber = editValues.phoneNumber.trim()
        const enteredPassword = password.trim()

        if (!companyName) {
            setError('Denumirea companiei este obligatorie.')
            return
        }

        if (!phoneNumber) {
            setError('Numărul de telefon este obligatoriu.')
            return
        }

        if (!enteredPassword) {
            setError('Parola este obligatorie.')
            return
        }

        setIsSaving(true)
        setError(null)
        setSuccessMessage(null)

        const updatedProfile: BusinessProfileResponse = {
            ...profile,
            companyName,
            phoneNumber,
            idnoCode: editValues.idnoCode.trim() || null,
            locationAdress: editValues.locationAdress.trim() || null,
            tvaCode: editValues.tvaCode.trim() || null,
            email: editValues.email.trim() || null,
            contactPerson: editValues.contactPerson.trim() || null,
            responsiblePerson: editValues.responsiblePerson.trim() || null,
            eoriCode: editValues.eoriCode.trim() || null,
        }

        try {
            const message = await updateBusinessProfile(userId, {
                password: enteredPassword,
                companyName: updatedProfile.companyName,
                phoneNumber: updatedProfile.phoneNumber,
                idnoCode: updatedProfile.idnoCode,
                locationAdress: updatedProfile.locationAdress,
                tvaCode: updatedProfile.tvaCode,
                email: updatedProfile.email,
                contactPerson: updatedProfile.contactPerson,
                responsiblePerson: updatedProfile.responsiblePerson,
                eoriCode: updatedProfile.eoriCode,
            })

            setProfile(updatedProfile)
            setEditValues(toEditValues(updatedProfile))

            if (session) {
                setSession({
                    ...session,
                    email: updatedProfile.email ?? null,
                    phoneNumber: updatedProfile.phoneNumber,
                })
            }

            setSuccessMessage(message || 'Datele au fost salvate cu succes.')
            setPassword('')
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && typeof err.response?.data === 'string') {
                setError(err.response.data)
            } else {
                setError('Nu s-au putut salva datele.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Se încarcă profilul...
            </div>
        )
    }

    if (error && !profile) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
            </div>
        )
    }

    if (!profile) {
        return null
    }

    const fields: [string, string, boolean][] = [
        ['Companie', profile.companyName, true],
        ['IDNO', profile.idnoCode ?? '', false],
        ['EORI', profile.eoriCode ?? '', true],
        ['Email', profile.email ?? '', true],
        ['Telefon', profile.phoneNumber, true],
        ['Adresă', profile.locationAdress ?? '', false],
        ['Cod TVA', profile.tvaCode ?? '', false],
        ['Persoană contact', profile.contactPerson ?? '', false],
        ['Persoană responsabilă', profile.responsiblePerson ?? '', false],
    ]
    const needsVerification = hasMissingBusinessProfileData(profile)

    return (
        <div className="space-y-8">
            {needsVerification ? <BusinessVerificationBanner /> : null}

            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1B3A5F' }}>Setări companie</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Informațiile firmei, datele de contact și credențialele contului.
                </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 divide-y divide-gray-100">
                <p className="pb-3 text-base font-semibold text-gray-900">Date companie</p>
                {fields.map(([label, value, isRequired]) => (
                    <ProfileInfoRow key={label} label={label} value={value} required={isRequired} labelClassName="w-40" />
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
                <p className="text-base font-semibold text-gray-900">Modificare date</p>

                {([
                    ['companyName', 'Companie', 'text', true],
                    ['idnoCode', 'IDNO', 'text', false],
                    ['eoriCode', 'EORI', 'text', true],
                    ['email', 'Email', 'email', true],
                    ['phoneNumber', 'Telefon', 'tel', true],
                    ['locationAdress', 'Adresă', 'text', false],
                    ['tvaCode', 'Cod TVA', 'text', false],
                    ['contactPerson', 'Persoană contact', 'text', false],
                    ['responsiblePerson', 'Persoană responsabilă', 'text', false],
                ] as [keyof EditValues, string, string, boolean][]).map(([key, label, type, isRequired]) => {
                    const isMissing = isRequired && isMissingProfileValue(editValues[key])

                    return (
                        <div key={key}>
                            <div className="flex items-center gap-2 mb-1">
                                <label className={`block text-xs font-medium ${isMissing ? 'text-red-600' : 'text-gray-600'}`}>
                                    {label}
                                </label>
                                {isMissing ? (
                                    <span className="text-red-500 text-xs font-bold">*</span>
                                ) : null}
                            </div>
                            <input
                                type={type}
                                value={editValues[key]}
                                onChange={(e) => setEditValues({ ...editValues, [key]: e.target.value })}
                                className={`w-full rounded-lg border ${
                                    isMissing
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                } px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 ${
                                    isMissing ? 'focus:ring-red-500/20' : 'focus:ring-gray-500/20'
                                }`}
                            />
                        </div>
                    )
                })}

                <div>
                    <p className="text-sm font-medium text-gray-900">Confirmare parolă</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Pentru a salva modificările, introdu parola contului companiei.
                    </p>
                    <div className="relative mt-3">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
                            aria-label={showPassword ? 'Ascunde parola' : 'Afiseaza parola'}
                        >
                            <img
                                src={showPassword ? '/images/noviewpass.svg' : '/images/viewpass.svg'}
                                alt=""
                                className="h-5 w-5"
                            />
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
                ) : null}
                {successMessage ? (
                    <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>
                ) : null}

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !password.trim()}
                    className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {isSaving ? 'Se salvează...' : 'Salvează modificările'}
                </button>
            </div>
        </div>
    )
}
