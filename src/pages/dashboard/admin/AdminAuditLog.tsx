export default function AdminAuditLog() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Log</h1>
      <p className="text-gray-500 mb-6">
        Istoricul tuturor acțiunilor importante din sistem – cine a făcut o modificare și la ce moment.
      </p>

      {/* TODO: tabel audit log cu filtrare după utilizator, acțiune, dată */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
        Jurnalul de audit va fi afișat aici.
      </div>
    </div>
  );
}
