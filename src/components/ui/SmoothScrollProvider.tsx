"use client";

import { useLenis } from "@/lib/useLenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();
  return <>{children}</>;
}
