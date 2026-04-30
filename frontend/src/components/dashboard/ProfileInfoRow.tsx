import { isMissingProfileValue } from '../../utils/profileValidation'

type ProfileInfoRowProps = {
    label: string
    value?: string | number | null
    required?: boolean
    labelClassName?: string
}

export default function ProfileInfoRow({
    label,
    value,
    required = false,
    labelClassName = 'w-36',
}: ProfileInfoRowProps) {
    const isMissing = required && isMissingProfileValue(value)
    const displayValue = isMissingProfileValue(value) ? '—' : String(value)

    return (
        <div className={`flex justify-between py-3 text-sm ${isMissing ? 'bg-red-50' : ''}`}>
            <div className="flex items-center gap-2">
                <span className={`${labelClassName} ${isMissing ? 'text-red-700 font-medium' : 'text-gray-500'}`}>
                    {label}
                </span>
                {isMissing ? (
                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Obligatoriu
                    </span>
                ) : null}
            </div>
            <span className={`font-medium flex-1 text-right ${isMissing ? 'text-red-700' : 'text-gray-900'}`}>
                {displayValue}
            </span>
        </div>
    )
}
