"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

/** Rehydrate the persisted demo store after mount (SSR-safe). */
export function StoreHydrator() {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);
  return null;
}

/** True only after the first client render — safe for hydration. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
