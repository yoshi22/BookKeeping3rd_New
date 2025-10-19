import React, { createContext, useContext, ReactNode } from "react";
import { useAppInitialization } from "../hooks/useAppInitialization";

type AppInitializationValue = ReturnType<typeof useAppInitialization>;

const AppInitializationContext =
  createContext<AppInitializationValue | null>(null);

export function AppInitializationProvider({ children }: { children: ReactNode }) {
  const initState = useAppInitialization();

  return (
    <AppInitializationContext.Provider value={initState}>
      {children}
    </AppInitializationContext.Provider>
  );
}

export function useAppInitializationContext() {
  const context = useContext(AppInitializationContext);
  if (!context) {
    throw new Error(
      "useAppInitializationContext must be used within AppInitializationProvider",
    );
  }
  return context;
}
