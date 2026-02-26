export default function AdminInvoices() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice-uri</h1>
      <p className="text-gray-500 mb-6">
        Lista facturilor generate pentru declarații – verificați statusul plăților și confirmați încasările.
      </p>

      {/* TODO: tabel facturi cu statusul plăților */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
        Lista facturilor va fi afișată aici.
      </div>
    </div>
  );
}
