import type { BusinessProfileResponse, PhysicalProfileResponse } from '../api/types/profile'

export function isMissingProfileValue(value?: string | number | null) {
    if (value === null || value === undefined) {
        return true
    }

    if (typeof value === 'string') {
        const trimmedValue = value.trim()
        return trimmedValue.length === 0 || trimmedValue === '—'
    }

    return false
}

export function hasMissingPhysicalProfileData(profile: PhysicalProfileResponse) {
    return (
        isMissingProfileValue(profile.fullName)
        || isMissingProfileValue(profile.phoneNumber)
        || isMissingProfileValue(profile.locationAddress)
        || isMissingProfileValue(profile.idnp)
        || isMissingProfileValue(profile.email)
    )
}

export function hasMissingBusinessProfileData(profile: BusinessProfileResponse) {
    return (
        isMissingProfileValue(profile.companyName)
        || isMissingProfileValue(profile.phoneNumber)
        || isMissingProfileValue(profile.eoriCode)
        || isMissingProfileValue(profile.email)
    )
}
