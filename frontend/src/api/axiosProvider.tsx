import { useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./axios";
import { AxiosContext } from "./axiosContext";

export function AxiosProvider({ children }: { children: ReactNode }) {
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 500) {
          setServerErrorMessage("Serverul a raspuns cu eroarea 500.");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      api,
      serverErrorMessage,
      clearServerError: () => setServerErrorMessage(null),
    }),
    [serverErrorMessage],
  );

  return <AxiosContext.Provider value={contextValue}>{children}</AxiosContext.Provider>;
}
