export const STATUS_COLORS: Record<string, string> = {
    'Approved':'bg-green-100 text-green-800',
    'Pending Documents':'bg-yellow-100 text-yellow-800',
    'Under Review':'bg-blue-100 text-blue-800',
    'Rejected':'bg-red-100 text-red-800',
}

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    )
}
