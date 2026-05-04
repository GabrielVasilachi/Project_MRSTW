import { Link } from "react-router-dom";

// Customs portal illustration — checkpoint scene
function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

      {/* ── sky gradient ── */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe"/>
          <stop offset="100%" stopColor="#eff6ff"/>
        </linearGradient>
      </defs>
      <rect x="60" y="80" width="370" height="240" rx="6" fill="url(#sky)"/>

      {/* ── ground / road ── */}
      <rect x="60" y="290" width="370" height="30" rx="0" fill="#1e3a5f"/>
      {/* road dashes */}
      <rect x="100" y="303" width="40" height="5" rx="2" fill="white" opacity="0.4"/>
      <rect x="180" y="303" width="40" height="5" rx="2" fill="white" opacity="0.4"/>
      <rect x="260" y="303" width="40" height="5" rx="2" fill="white" opacity="0.4"/>
      <rect x="340" y="303" width="40" height="5" rx="2" fill="white" opacity="0.4"/>
      {/* pavement */}
      <rect x="60" y="318" width="370" height="30" rx="0" fill="#334155"/>

      {/* ── mountains / hills in bg ── */}
      <path d="M60 290 Q120 200 180 240 Q220 190 280 240 Q330 195 390 240 L430 290Z" fill="#93c5fd" opacity="0.4"/>
      <path d="M60 290 Q110 230 160 260 Q200 230 250 265 Q290 235 340 260 Q370 240 430 290Z" fill="#bfdbfe" opacity="0.5"/>

      {/* ── checkpoint booth ── */}
      {/* booth base */}
      <rect x="265" y="210" width="60" height="80" rx="4" fill="#1e3a5f"/>
      {/* booth window */}
      <rect x="274" y="218" width="42" height="28" rx="3" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1.5"/>
      {/* window reflection */}
      <line x1="280" y1="219" x2="278" y2="245" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      {/* booth roof */}
      <rect x="260" y="205" width="70" height="10" rx="3" fill="#2563eb"/>
      {/* booth door */}
      <rect x="283" y="256" width="24" height="34" rx="2" fill="#2563eb" opacity="0.7"/>
      <circle cx="300" cy="274" r="2" fill="#fbbf24"/>

      {/* ── barrier arm ── */}
      {/* pole */}
      <rect x="230" y="240" width="8" height="52" rx="3" fill="#1e3a5f"/>
      {/* arm */}
      <rect x="234" y="240" width="100" height="8" rx="4" fill="#ef4444"/>
      {/* arm stripes */}
      <rect x="250" y="240" width="10" height="8" rx="1" fill="white"/>
      <rect x="278" y="240" width="10" height="8" rx="1" fill="white"/>
      <rect x="306" y="240" width="10" height="8" rx="1" fill="white"/>
      {/* counterweight */}
      <rect x="218" y="240" width="18" height="10" rx="3" fill="#1e3a5f"/>

      {/* ── truck ── */}
      {/* trailer */}
      <rect x="68" y="218" width="130" height="72" rx="5" fill="#eff6ff" stroke="#1e3a5f" strokeWidth="2"/>
      {/* trailer ribs */}
      <line x1="102" y1="218" x2="102" y2="290" stroke="#bfdbfe" strokeWidth="1.5"/>
      <line x1="136" y1="218" x2="136" y2="290" stroke="#bfdbfe" strokeWidth="1.5"/>
      <line x1="170" y1="218" x2="170" y2="290" stroke="#bfdbfe" strokeWidth="1.5"/>
      {/* company text on trailer */}
      <rect x="80" y="240" width="80" height="22" rx="3" fill="#dbeafe"/>
      <rect x="84" y="244" width="50" height="4" rx="1" fill="#2563eb" opacity="0.6"/>
      <rect x="84" y="252" width="36" height="4" rx="1" fill="#2563eb" opacity="0.4"/>
      {/* cab */}
      <path d="M198 238 L198 290 L228 290 L228 254 L214 238 Z" fill="#1e3a5f" stroke="#1e3a5f" strokeWidth="1"/>
      {/* cab window */}
      <path d="M200 242 L200 258 L224 258 L224 248 L214 240 Z" fill="#93c5fd" stroke="#2563eb" strokeWidth="1"/>
      {/* cab door */}
      <rect x="200" y="262" width="24" height="26" rx="2" fill="#162d4a"/>
      <circle cx="218" cy="276" r="2" fill="#93c5fd"/>
      {/* exhaust */}
      <rect x="224" y="222" width="5" height="18" rx="2" fill="#64748b"/>
      <circle cx="226" cy="221" r="4" fill="#94a3b8" opacity="0.5"/>
      {/* wheels */}
      <circle cx="100" cy="304" r="16" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <circle cx="100" cy="304" r="7" fill="#64748b"/>
      <circle cx="178" cy="304" r="16" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <circle cx="178" cy="304" r="7" fill="#64748b"/>
      <circle cx="216" cy="304" r="14" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <circle cx="216" cy="304" r="6" fill="#64748b"/>

      {/* ── floating document card ── */}
      <rect x="330" y="110" width="100" height="78" rx="8" fill="white" stroke="#bfdbfe" strokeWidth="1.5"
        style={{filter:'drop-shadow(0 4px 12px rgba(37,99,235,0.12))'}}/>
      {/* doc header */}
      <rect x="330" y="110" width="100" height="16" rx="8" fill="#2563eb"/>
      <rect x="330" y="118" width="100" height="8" rx="0" fill="#2563eb"/>
      <rect x="338" y="114" width="40" height="4" rx="1" fill="white" opacity="0.7"/>
      {/* doc lines */}
      <rect x="338" y="135" width="60" height="4" rx="1" fill="#bfdbfe"/>
      <rect x="338" y="143" width="48" height="4" rx="1" fill="#bfdbfe"/>
      <rect x="338" y="151" width="54" height="4" rx="1" fill="#bfdbfe"/>
      <rect x="338" y="159" width="36" height="4" rx="1" fill="#bfdbfe"/>
      {/* stamp */}
      <circle cx="402" cy="158" r="14" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 2"/>
      <text x="402" y="163" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2563eb">✓ OK</text>

      {/* ── floating status badge ── */}
      <rect x="68" y="110" width="120" height="44" rx="10" fill="white" stroke="#bfdbfe" strokeWidth="1.5"
        style={{filter:'drop-shadow(0 4px 12px rgba(37,99,235,0.10))'}}/>
      <circle cx="90" cy="132" r="10" fill="#dcfce7"/>
      <text x="90" y="137" textAnchor="middle" fontSize="11" fill="#16a34a">✓</text>
      <rect x="106" y="124" width="60" height="5" rx="2" fill="#bfdbfe"/>
      <rect x="106" y="133" width="44" height="5" rx="2" fill="#dbeafe"/>

      {/* ── location pin above booth ── */}
      <path d="M295 92 C285 92 278 99 278 108 C278 120 295 134 295 134 C295 134 312 120 312 108 C312 99 305 92 295 92Z" fill="#2563eb"/>
      <circle cx="295" cy="108" r="6" fill="white"/>

    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-0">

          {/* Left: text */}
          <div className="w-full md:w-1/2 md:pr-12">
            <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-4">Portal Vamal Digital — Moldova</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              SERVICII VAMALE<br />
              <span className="text-blue-600">SIMPLU ȘI RAPID</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
              Înregistrați colete internaționale, calculați taxele vamale și urmăriți statusul declarațiilor — totul online, fără cozi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 px-8 py-3.5 text-sm font-bold text-white uppercase tracking-wider shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
                Intră în cont
              </Link>
              <Link to="/guide"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-300 px-8 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider transition-all hover:-translate-y-0.5">
                Cum funcționează
              </Link>
            </div>

            {/* Mini stats */}
            <div className="mt-12 flex gap-8">
              {[
                { value: '24h', label: 'Procesare' },
                { value: '100%', label: 'Online' },
                { value: '24/7', label: 'Acces' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-blue-600">{s.value}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="bg-blue-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>,
                title: 'Procesare rapidă',
                desc: 'Cereri procesate în 24-48 ore. Fără cozi, fără deplasări la ghișeu.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>,
                title: 'Securizat',
                desc: 'Datele dvs. protejate prin criptare, conform standardelor europene.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>,
                title: 'Notificări instant',
                desc: 'Urmăriți statusul declarației în timp real la fiecare etapă.',
              },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USER TYPES ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Pentru cine este?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Persoane fizice</h3>
            <p className="text-gray-500 leading-relaxed mb-6">Interfață simplificată pentru colete personale. Înregistrare rapidă, urmărire și plăți online.</p>
            <ul className="space-y-2">
              {['Urmărire colete în timp real', 'Calculator taxe vamale', 'Documente digitale', 'Notificări automate'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"/>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-10 shadow-lg text-white hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Persoane juridice</h3>
            <p className="text-blue-100 leading-relaxed mb-6">Funcționalități avansate pentru companii: declarații în masă, rapoarte și facturare automată.</p>
            <ul className="space-y-2">
              {['Import în masă de declarații', 'Rapoarte și statistici', 'Gestionare documente', 'Facturare automată'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-blue-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"/>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-14">Cum funcționează?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Creare cont', desc: 'Înregistrați-vă ca persoană fizică sau juridică în câteva minute.' },
              { step: '02', title: 'Înregistrare colet', desc: 'Adăugați detaliile coletului și documentele necesare.' },
              { step: '03', title: 'Calcul taxe', desc: 'Sistemul calculează automat taxele vamale aplicabile.' },
              { step: '04', title: 'Urmărire status', desc: 'Urmăriți declarația în timp real până la vămuire finală.' },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-lg mb-5 ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-2 border-blue-100 text-blue-600'}`}>
                  {s.step}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Gata să începeți?</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Accesați platforma și simplificați procesul vamal al afacerii sau al coletelor personale.
        </p>
        <Link to="/login"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-10 py-4 text-sm font-bold text-white uppercase tracking-wider shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
          Autentificare
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        </Link>
      </section>

    </div>
  );
}
