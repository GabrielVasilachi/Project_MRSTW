import BaseButton from "../components/base/BaseButton";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      <div className="bg-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Gestionați coletele și taxele vamale{" "}
            <span className="text-blue-600">simplu și rapid</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platformă digitală pentru înregistrarea coletelor internaționale și calculul
            transparent al taxelor vamale. Pentru persoane fizice și juridice.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <BaseButton variant="primary">Înregistrare</BaseButton>
            </Link>
            <Link to="/login">
              <BaseButton variant="secondary">Autentificare</BaseButton>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Rapid</h3>
          <p className="text-base text-gray-600 leading-relaxed">
            Procesare accelerată a cererilor în 24-48 ore lucrătoare.
          </p>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Securizat</h3>
          <p className="text-base text-gray-600 leading-relaxed">
            Datele dvs. sunt protejate conform standardelor europene.
          </p>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Urmărire status</h3>
          <p className="text-base text-gray-600 leading-relaxed">
            Notificări instant la fiecare etapă a procesului vamal.
          </p>
        </div>
      </div>

      {/* User Types Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Pentru toate tipurile de utilizatori
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Persoane fizice</h2>
                <p className="text-gray-600 leading-relaxed">
                  Interfață simplificată pentru gestionarea coletelor personale. Înregistrare
                  rapidă și urmărire intuitivă a statusului.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Persoane juridice</h2>
                <p className="text-gray-600 leading-relaxed">
                  Funcționalități avansate pentru companii: comenzi recurente, istoric plăți,
                  rapoarte și gestionare în bloc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}