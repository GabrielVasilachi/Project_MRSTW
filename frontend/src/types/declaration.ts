export type Declaration = {
    id: string
    declaration_type?: 'physical' | 'legal'
    user_id: string
    package_id?: number | null
    awb_number: string
    hs_code: string
    description: string
    quantity: number
    gross_weight: number
    customs_value: number
    currency: string
    currency_value?: number
    category?: number
    vat: number
    customs_duty: number
    excise: number
    total_taxes: number
    status: string
    status_value?: number
    sender_name?: string
    product_url?: string
    category_label?: string
}
