type Props = { label: string; value: string; sub?: string }

export default function KpiCard({ label, value, sub }: Props) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide" style={{ color: '#1B3A5F' }}>{label}</p>
            <p className="mt-2 text-2xl font-bold" style={{ color: '#1B3A5F' }}>{value}</p>
            {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
    )
}
