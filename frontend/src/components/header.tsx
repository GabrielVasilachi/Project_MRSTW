import { Link } from 'react-router-dom'
import BaseButton from './base/BaseButton'
import Logo from '../../public/images/Logo.svg'

export default function Header() {
    return (
        <header className="bg-white sticky shadow-md w-full z-40">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="h-8 w-8" />
                        <span className="text-xl font-bold text-gray-800">Portal Vamal</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Acasă</Link>
                        <Link to="/guide" className="text-gray-700 hover:text-blue-600 font-medium transition">Cum funcționează</Link>
                        <Link to="/faq" className="text-gray-700 hover:text-blue-600 font-medium transition">FAQ</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/signup">
                            <BaseButton variant="primary">Înregistrare</BaseButton>
                        </Link>
                        <Link to="/login">
                            <BaseButton variant="secondary">Autentificare</BaseButton>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}
