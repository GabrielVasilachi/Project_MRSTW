import React from 'react';

const HowItWorksStep: React.FC = () => {
  const createAccount = [
    "Alegeți tipul de cont (persoană fizică sau juridică)",
    "Completați datele de identificare",
    "Confirmați adresa de email",
    "Setați o parolă sigură"
  ];

  const registerParcel = [
    "Încărcați documentele necesare pentru colet",
    "Completați detaliile despre colet și bunuri",
    "Selectați modalitatea de transport și tipul de bunuri"
  ];

  const verifyDocuments = [
    "Oficiul vamal verifică autenticitatea documentelor",
    "Clasifică tarifară bunurile",
    "Calculează TVA, taxe vamale și accize (dacă este cazul)",
    "Timp estimat de procesare: 24-48 ore"
  ];

  const requestAdditionalInfo = [
    "Dacă sunt necesare documente suplimentare, veți fi notificat",
    "Puteți încărca documente adiționale",
    "Puteți comunica direct cu inspectorul vamal pentru clarificări",
    "Termenul de răspuns pentru solicitarea de informații: 5 zile lucrătoare"
  ];

  const payDuties = [
    "După aprobare, veți vedea defalcarea completă a taxelor",
    "Puteți plăti online cu card bancar sau la ghișeu la ridicarea coletului",
    "Primiți chitanță electronică după plată"
  ];

  const pickUpParcel = [
    "Prezentați-vă la punctul vamal cu documentele necesare pentru ridicare",
    "Asigurați-vă că aveți confirmarea plății (electronică sau chitanță) și un act de identitate valid",
    "Coletul vă va fi eliberat pe loc după verificare"
  ];  

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Creați un cont</h3>
            <p className="text-sm text-gray-600 mb-3">
              Înregistrați-vă ca persoană fizică sau juridică. Procesul durează doar 2 minute.
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {createAccount.map((step, index) => (
                <li key={index}>• {step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Înregistrați coletul</h3>
            <p className="text-sm text-gray-600 mb-3">
              Încărcați documentele necesare pentru coletul dvs.
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {registerParcel.map((step, index) => (
                <li key={index}>• {step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">3. Verificare documente</h3>
            <p className="text-sm text-gray-600 mb-3">
              Oficiul vamal verifică documentele și calculează taxele.
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {verifyDocuments.map((step, index) => (
                <li key={index}>• {step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">4. Solicitare informații (dacă este cazul)</h3>
            <p className="text-sm text-gray-600 mb-3">
              Dacă sunt necesare documente suplimentare, veți fi notificat.
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {requestAdditionalInfo.map((step, index) => (
                <li key={index}>• {step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">5. Plata taxelor</h3>
            <p className="text-sm text-gray-600 mb-3">
              După aprobare, plătiți taxele calculate online sau la sediu.
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {payDuties.map((step, index) => (
                <li key={index}>• {step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">6. Ridicarea coletului</h3>
            <p className="text-sm text-gray-600 mb-3">
              Prezentați-vă la punctul vamal cu documentele pentru ridicare.
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {pickUpParcel.map((step, index) => (
                <li key={index}>• {step}</li>
              ))} 
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksStep;
