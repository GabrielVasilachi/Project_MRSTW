import type { AxiosInstance } from "axios";
import { createContext } from "react";

export type AxiosContextValue = {
  api: AxiosInstance;
  serverErrorMessage: string | null;
  clearServerError: () => void;
};

export const AxiosContext = createContext<AxiosContextValue | null>(null);
