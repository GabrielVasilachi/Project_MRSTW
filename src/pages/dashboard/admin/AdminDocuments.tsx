export default function AdminDocuments() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Documente</h1>
      <p className="text-gray-500 mb-6">
        Documentele încărcate de utilizatori – verificați, aprobați sau solicitați completări.
      </p>

      {/* TODO: listă documente cu opțiuni de aprobare/respingere */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
        Lista documentelor va fi afișată aici.
      </div>
    </div>
  );
}
