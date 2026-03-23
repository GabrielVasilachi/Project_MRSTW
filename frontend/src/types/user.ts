export type PhysicalUser = {
    id: string
    full_name: string
    idnp: string
    email: string
    phone: string
    address: string
}

export type JuridicalUser = {
    id: string
    company_name: string
    tax_id: string
    eori: string
    vat_registered: boolean
    email: string
    phone: string
    address: string
}
