import data from '../../_mock/mock_persoana_fizica.json'

type PhysicalUser = {
    id: string
    type: 'physical'
    full_name: string
    idnp: string
    email: string
    phone: string
    address: string
}

type Declaration = {
    id: string
    user_id: string
    awb_number: string
    hs_code: string
    description: string
    quantity: number
    gross_weight: number
    customs_value: number
    currency: string
    vat: number
    customs_duty: number
    excise: number
    total_taxes: number
    status: string
}

type Mock = {
    users: PhysicalUser[]
    declarations: Declaration[]
}

function formatMoney(value: number, currency: string) {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value)
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-2 text-xl font-semibold text-gray-900">{value}</div>
        </div>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2">
            <div className="text-sm text-gray-600">{label}</div>
            <div className="text-sm font-medium text-gray-900 text-right">{value}</div>
        </div>
    )
}

function Dashboard_Individual() {
    const mock = data as Mock


    const person = mock.users[0]
    if (!person) {
        return null
    }

    const declarations = mock.declarations.filter((d) => d.user_id === person.id)
    const totalTaxes = declarations.reduce((sum, d) => sum + d.total_taxes, 0)
    const totalValue = declarations.reduce((sum, d) => sum + d.customs_value, 0)
    const currency = declarations[0]?.currency ?? 'EUR'

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="text-sm text-gray-500">Persoană fizică</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{person.full_name}</div>

                <div className="mt-4 divide-y divide-gray-100">
                    <Row label="IDNP" value={person.idnp} />
                    <Row label="Email" value={person.email} />
                    <Row label="Telefon" value={person.phone} />
                    <Row label="Adresă" value={person.address} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Stat label="Declarații" value={String(declarations.length)} />
                <Stat label="Valoare vamală (total)" value={formatMoney(totalValue, currency)} />
                <Stat label="Taxe (total)" value={formatMoney(totalTaxes, currency)} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="text-base font-semibold text-gray-900">Declarații</div>
                    <div className="mt-1 text-sm text-gray-600">Doar declarațiile persoanei curente.</div>
                </div>

                {declarations.length === 0 ? (
                    <div className="px-6 py-6 text-sm text-gray-600">Nu există declarații pentru această persoană.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">AWB</th>
                                    <th className="px-6 py-3 font-medium">Descriere</th>
                                    <th className="px-6 py-3 font-medium">Valoare</th>
                                    <th className="px-6 py-3 font-medium">Taxe</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {declarations.map((d) => (
                                    <tr key={d.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">{d.awb_number}</td>
                                        <td className="px-6 py-3 text-gray-700">{d.description}</td>
                                        <td className="px-6 py-3 text-gray-700">{formatMoney(d.customs_value, d.currency)}</td>
                                        <td className="px-6 py-3 text-gray-700">{formatMoney(d.total_taxes, d.currency)}</td>
                                        <td className="px-6 py-3 text-gray-700">{d.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard_Individual