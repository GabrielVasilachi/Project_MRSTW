import axios, { type AxiosInstance } from "axios";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type AxiosContextValue = {
  api: AxiosInstance;
  serverErrorMessage: string | null;
  clearServerError: () => void;
};

const AxiosContext = createContext<AxiosContextValue | null>(null);

export function AxiosProvider({ children }: { children: ReactNode }) {
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);

  const apiRef = useRef<AxiosInstance>(
    axios.create({
      baseURL: "http://localhost:5242/api",
      timeout: 10000,
    }),
  );

  useEffect(() => {
    const interceptorId = apiRef.current.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 500) {
          setServerErrorMessage("Serverul a raspuns cu eroarea 500.");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      apiRef.current.interceptors.response.eject(interceptorId);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      api: apiRef.current,
      serverErrorMessage,
      clearServerError: () => setServerErrorMessage(null),
    }),
    [serverErrorMessage],
  );

  return <AxiosContext.Provider value={contextValue}>{children}</AxiosContext.Provider>;
}

export function useAxios() {
  const context = useContext(AxiosContext);

  if (!context) {
    throw new Error("useAxios trebuie folosit in AxiosProvider.");
  }

  return context;
}
