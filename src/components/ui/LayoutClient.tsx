"use client";

import { createContext, useContext, useState } from "react";
import { Preloader } from "@/components/ui/Preloader";
import { Cursor } from "@/components/ui/Cursor";
import { Nav } from "@/components/ui/Nav";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";

const PreloaderContext = createContext(false);
export const usePreloaderDone = () => useContext(PreloaderContext);

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <PreloaderContext.Provider value={isLoaded}>
      <SmoothScrollProvider>
        {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
        <Cursor />
        <Nav />
        <main>{children}</main>
      </SmoothScrollProvider>
    </PreloaderContext.Provider>
  );
}
