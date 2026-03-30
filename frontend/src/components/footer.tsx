import React from "react"
import { Link } from "react-router-dom"
import footer_content from "../content/Cards_Footer.json"

const Footer: React.FC = () => {
  const navigation = footer_content.navigation
  const contactInfo = footer_content.contactInfo
  const legalLinks = footer_content.legalLinks
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Portal Vamal</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Platformă digitală pentru gestionarea coletelor și taxelor vamale.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Navigare rapidă</h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.name === "Autentificare" ? (
                    <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                  ) : (
                    <a href={item.link} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-3">
              {Object.entries(contactInfo).map(([key, value]) => (
                <li key={key} className="text-sm text-gray-600">
                  <span className="capitalize">{key}</span>: {value}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.link} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
