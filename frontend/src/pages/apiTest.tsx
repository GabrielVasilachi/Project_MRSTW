import { useState } from "react";
import { useAxios } from "../api/useAxios";

export default function ApiTestPage() {
  const { api, serverErrorMessage, clearServerError } = useAxios();
  const [healthMessage, setHealthMessage] = useState("-");
  const [lastAction, setLastAction] = useState("Nicio cerere trimisa.");

  const checkHealth = async () => {
    clearServerError();

    try {
      const response = await api.get<string>("/health");
      setHealthMessage(response.data);
      setLastAction("Cererea GET /api/health a fost facuta cu succes.");
    } catch {
      setLastAction("Cererea GET /api/health a esuat.");
    }
  };

  const check500 = async () => {
    clearServerError();

    try {
      await api.get("/health/test-500");
      setLastAction("Endpoint-ul de test nu a intors 500.");
    } catch {
      setLastAction("Cererea GET /api/health/test-500 a fost trimisa.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Test conexiune front-back</h1>
      <p className="mt-2 text-gray-600">Pagina simpla pentru verificarea endpoint-urilor de backend.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={checkHealth}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Test health
        </button>

        <button
          type="button"
          onClick={check500}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Test eroare 500
        </button>
      </div>

      <div className="mt-6 rounded border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-700"><strong>Raspuns health:</strong> {healthMessage}</p>
        <p className="mt-2 text-sm text-gray-700"><strong>Ultima actiune:</strong> {lastAction}</p>

        {serverErrorMessage && (
          <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">
            <strong>Mesaj interceptor:</strong> {serverErrorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
