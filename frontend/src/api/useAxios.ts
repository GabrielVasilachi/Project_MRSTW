import { useContext } from "react";
import { AxiosContext } from "./axiosContext";

export function useAxios() {
  const context = useContext(AxiosContext);

  if (!context) {
    throw new Error("useAxios trebuie folosit in AxiosProvider.");
  }

  return context;
}
