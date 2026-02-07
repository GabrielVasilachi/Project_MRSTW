export default function BaseButton({ children, variant }: { children: React.ReactNode, variant: 'primary' | 'secondary' }) {
    return (
        <button className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
            {children}
        </button>
    );
}