import { useEffect, useState } from 'react'
import axios from 'axios'

import { getDocumentsByUserId } from '../../../api/documentsApi'
import { getBusinessProfileByUserId, getPhysicalProfileByUserId } from '../../../api/profilesApi'
import type { DocumentInfo } from '../../../api/types/document'
import type { UserResponse } from '../../../api/types/user'
import { getUsers } from '../../../api/usersApi'
import type { UserRole } from '../../../auth/auth.types'
import { mapRoleEnumToUserRole } from '../../../auth/auth.utils'

export type AdminDashboardUser = {
    id: string
    userId: number
    role: UserRole
    roleLabel: string
    name: string
    email: string | null
    phoneNumber: string
    address: string | null
    idnp: string | null
    idnoCode: string | null
    eoriCode: string | null
    tvaCode: string | null
    contactPerson: string | null
    isTemporary: boolean
    isPhoneConfirmed: boolean | null
    createdAt: string | null
    documents: DocumentInfo[]
}

export type AdminDocumentRow = DocumentInfo & {
    userName: string
    userRole: string
}

type AdminDashboardState = {
    users: AdminDashboardUser[]
    documents: AdminDocumentRow[]
    loading: boolean
    error: string | null
}

function getRoleLabel(role: UserRole) {
    if (role === 'admin') return 'Administrator'
    if (role === 'business') return 'Persoană juridică'
    return 'Persoană fizică'
}

function getApiErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 || error.response?.status === 405) {
            return 'Endpointul GET /users nu este disponibil în backend-ul curent.'
        }

        if (typeof error.response?.data === 'string') {
            return error.response.data
        }
    }

    return 'Nu s-au putut încărca datele din backend.'
}

async function getUserDocuments(userId: number) {
    try {
        return await getDocumentsByUserId(userId)
    } catch {
        return []
    }
}

async function toAdminDashboardUser(user: UserResponse): Promise<AdminDashboardUser> {
    const role = mapRoleEnumToUserRole(user.roleEnum)
    const documents = await getUserDocuments(user.id)

    const baseUser: AdminDashboardUser = {
        id: String(user.id),
        userId: user.id,
        role,
        roleLabel: getRoleLabel(role),
        name: user.fullName,
        email: user.email ?? null,
        phoneNumber: user.phoneNumber,
        address: null,
        idnp: null,
        idnoCode: null,
        eoriCode: null,
        tvaCode: null,
        contactPerson: null,
        isTemporary: user.isTemporary,
        isPhoneConfirmed: user.isPhoneConfirmed ?? null,
        createdAt: user.createdAt ?? null,
        documents,
    }

    try {
        if (role === 'individual') {
            const profile = await getPhysicalProfileByUserId(user.id)

            return {
                ...baseUser,
                name: profile.fullName,
                email: profile.email ?? baseUser.email,
                phoneNumber: profile.phoneNumber,
                address: profile.locationAddress,
                idnp: profile.idnp ?? null,
            }
        }

        if (role === 'business') {
            const profile = await getBusinessProfileByUserId(user.id)

            return {
                ...baseUser,
                name: profile.companyName,
                email: profile.email ?? baseUser.email,
                phoneNumber: profile.phoneNumber,
                address: profile.locationAdress ?? null,
                idnoCode: profile.idnoCode ?? null,
                eoriCode: profile.eoriCode ?? null,
                tvaCode: profile.tvaCode ?? null,
                contactPerson: profile.contactPerson ?? null,
            }
        }
    } catch {
        return baseUser
    }

    return baseUser
}

function toDocumentRows(users: AdminDashboardUser[]): AdminDocumentRow[] {
    return users.flatMap(user =>
        user.documents.map(document => ({
            ...document,
            userName: user.name,
            userRole: user.roleLabel,
        }))
    )
}

export function useAdminDashboardData(): AdminDashboardState {
    const [state, setState] = useState<AdminDashboardState>({
        users: [],
        documents: [],
        loading: true,
        error: null,
    })

    useEffect(() => {
        let ignore = false

        async function loadData() {
            try {
                const usersResponse = await getUsers()
                const users = await Promise.all(usersResponse.map(toAdminDashboardUser))

                if (!ignore) {
                    setState({
                        users,
                        documents: toDocumentRows(users),
                        loading: false,
                        error: null,
                    })
                }
            } catch (error: unknown) {
                if (!ignore) {
                    setState({
                        users: [],
                        documents: [],
                        loading: false,
                        error: getApiErrorMessage(error),
                    })
                }
            }
        }

        loadData()

        return () => {
            ignore = true
        }
    }, [])

    return state
}
