export default function AdminUsers() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Utilizatori</h1>
      <p className="text-gray-500 mb-6">
        Gestionați toate conturile (persoane fizice și juridice) – modificați roluri sau suspendați conturi.
      </p>

      {/* TODO: tabel utilizatori cu filtre și acțiuni */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
        Tabelul utilizatorilor va fi afișat aici.
      </div>
    </div>
  );
}
