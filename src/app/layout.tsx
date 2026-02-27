import type { Metadata } from "next";
import "@/styles/globals.css";
import { LayoutClient } from "@/components/ui/LayoutClient";

export const metadata: Metadata = {
  title: "Mahis — Brand Elevation & Web Experience Studio",
  description:
    "Boutique studio crafting immersive digital experiences for luxury brands and creative agencies.",
  openGraph: {
    title: "Mahis Studio",
    description: "Brand elevation through web experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-mahis-black text-mahis-white antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
