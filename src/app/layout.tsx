import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
   title: "Hav Imobiliária",
   description: "Site para nossa imobiliária Hav",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="pt">
         <body className={`antialiased`}>{children}</body>
      </html>
   );
}
