export default function AdminDeclarations() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Declarații vamale</h1>
      <p className="text-gray-500 mb-6">
        Vizualizați și gestionați toate declarațiile vamale – aprobare, respingere sau modificare status.
      </p>

      {/* TODO: tabel declarații cu filtre și acțiuni */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
        Tabelul declarațiilor va fi afișat aici.
      </div>
    </div>
  );
}
