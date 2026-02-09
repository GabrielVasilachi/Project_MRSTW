import BaseButton from "../components/base/BaseButton";

export default function LandingPage() {
  return (
    <>
      <div className="bg-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gestionați coletele și taxele vamale{' '}
            <span className="text-blue-600">simplu și rapid</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platformă digitală pentru înregistrarea coletelor internaționale și calculul 
            transparent al taxelor vamale. Pentru persoane fizice și juridice.
          </p>
          
          <div className="flex gap-4 justify-center">
            <BaseButton variant="primary">Înregistrare</BaseButton> 
            <BaseButton variant="secondary">Autentificare</BaseButton>
          </div>
        </div>
      </div>

      <div className="py-16 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          De ce să folosiți Portal Vamal?
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapid</h3>
            <p className="text-sm text-gray-600">
              Procesare accelerată a cererilor în 24-48 ore lucrătoare.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Securizat</h3>
            <p className="text-sm text-gray-600">
              Datele dvs. sunt protejate conform standardelor europene.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

