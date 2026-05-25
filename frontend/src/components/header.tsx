import { Link, useLocation } from 'react-router-dom'
import Logo from '../../public/images/Logo.svg'

export default function Header() {
    const { pathname } = useLocation()

    const navLinks = [
        { to: '/guide', label: 'Servicii' },
        { to: '/', label: 'Despre noi' },
        { to: '/faq', label: 'FAQ' },
    ]

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <img src={Logo} alt="Logo" className="h-7 w-7" />
                    <span className="text-base font-extrabold text-gray-900 tracking-tight">
                        Portal <span className="text-blue-600">Vamal</span>
                    </span>
                </Link>

                {/* Center nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm font-semibold transition-colors ${
                                pathname === link.to
                                    ? 'text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Auth button */}
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm font-bold text-white uppercase tracking-wider transition-colors shadow-md shadow-blue-100"
                >
                    Autentificare
                </Link>
            </nav>
        </header>
    )
}
