import { useEffect, useState } from 'react'

import { getBusinessProfileByUserId } from '../../../api/profilesApi'
import { getSession } from '../../../auth/auth.session'

export function useBusinessProfileName() {
    const session = getSession()
    const parsedUserId = session?.userId ? Number(session.userId) : null
    const userId = parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : null
    const [companyName, setCompanyName] = useState(session?.fullName ?? 'companiei')

    useEffect(() => {
        if (!userId) {
            return
        }

        const currentUserId = userId
        let ignore = false

        async function loadProfile() {
            try {
                const profile = await getBusinessProfileByUserId(currentUserId)

                if (!ignore) {
                    setCompanyName(profile.companyName)
                }
            } catch {
                if (!ignore) {
                    setCompanyName(session?.fullName ?? 'companiei')
                }
            }
        }

        loadProfile()

        return () => {
            ignore = true
        }
    }, [session?.fullName, userId])

    return companyName
}
