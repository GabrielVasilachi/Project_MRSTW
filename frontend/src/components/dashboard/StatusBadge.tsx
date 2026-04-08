import { STATUS_COLORS } from './statusColors'

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    )
}
