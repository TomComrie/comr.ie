"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type AiContextType = {
  hasError: boolean;
  setHasError: (v: boolean) => void;
};

const AiContext = createContext<AiContextType>({
  hasError: false,
  setHasError: () => {},
});

export function AiProvider({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);
  return (
    <AiContext.Provider value={{ hasError, setHasError }}>
      {children}
    </AiContext.Provider>
  );
}

export function useAiError() {
  return useContext(AiContext);
}
