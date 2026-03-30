import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

const faqs: FAQItemProps[] = [
  {
    question: "Ce documente sunt necesare pentru înregistrarea unui colet?",
    answer:
      "Aveți nevoie de documentul de comandă (factură sau confirmare de la magazin) și dovada plății (chitanță, extras de cont sau screenshot al tranzacției). Pentru bunuri de valoare mare sau anumite categorii, pot fi solicitate documente suplimentare.",
  },
  {
    question: "Cum se calculează taxele vamale?",
    answer:
      "Taxele vamale se calculează în funcție de valoarea declarată a coletului, categoria produsului și țara de origine. Platforma noastră calculează automat suma datorată conform reglementărilor în vigoare.",
  },
  {
    question: "Cât durează procesarea unei cereri?",
    answer:
      "Procesarea standard durează între 24 și 48 de ore lucrătoare de la momentul depunerii documentelor complete. În perioadele aglomerate, termenul poate fi extins la 72 de ore.",
  },
  {
    question: "Pot urmări statusul cererii mele?",
    answer:
      "Da, puteți urmări statusul cererii în timp real din contul dvs. Veți primi, de asemenea, notificări prin email la fiecare etapă importantă a procesului vamal.",
  },
  {
    question: "Ce se întâmplă dacă cererea mea este respinsă?",
    answer:
      "În cazul respingerii, veți fi notificat cu motivul detaliat. Puteți corecta documentele și redepune cererea fără costuri suplimentare în termen de 30 de zile.",
  },
  {
    question: "Există diferențe între conturile pentru persoane fizice și juridice?",
    answer:
      "Da. Conturile pentru persoane juridice oferă funcționalități suplimentare precum gestionarea în bloc a coletelor, rapoarte detaliate, istoricul plăților și posibilitatea de a adăuga mai mulți utilizatori sub același cont.",
  },
  {
    question: "Cum pot plăti taxele calculate?",
    answer:
      "Taxele pot fi achitate online prin card bancar, transfer bancar sau prin intermediul aplicațiilor de plată partenere. Toate tranzacțiile sunt securizate și veți primi o chitanță electronică.",
  },
  {
    question: "Coletele sub o anumită valoare sunt scutite de taxe?",
    answer:
      "Da, conform legislației în vigoare, coletele cu o valoare declarată sub pragul stabilit de autorități pot fi scutite de taxe vamale. Platforma identifică automat dacă coletul dvs. se încadrează în această categorie.",
  },
];

function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">{question}</span>
        <span className="flex-shrink-0 text-gray-500">
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5 bg-white">
          <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FrequentlyAskedQuestions() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 sm:mb-12">
        Întrebări frecvente
      </h1>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}