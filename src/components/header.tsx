import { Link } from 'react-router-dom'
import BaseButton from './base/BaseButton'

export default function Header() {
    return (
        <header className="bg-white sticky shadow-md w-full z-40">
        <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                     <img src="/public/package.svg" alt="Logo" className="h-8 w-8" /> 
                    <span className="text-xl font-bold text-gray-800">Portal Vamal</span>
                </div>
                
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-amber-600 font-medium transition">Acasă</Link>
                    <Link to="/guide" className="text-gray-700 hover:text-amber-600 font-medium transition">Cum funcționează</Link>
                    <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium transition">FAQ</a>
                </div>

                <div className="flex items-center space-x-4">
                   <BaseButton variant="primary">Înregistrare</BaseButton>
                   <BaseButton variant="secondary">Autentificare</BaseButton>
                </div>
            </div>
        </nav>
    </header>
    )
}
