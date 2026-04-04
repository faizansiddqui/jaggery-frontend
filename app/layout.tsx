import type { Metadata } from "next";
import { Inter, Space_Grotesk, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";
import { Providers } from "./context/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-headline" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: "STREETRIOT | Precision Streetwear",
  description: "High-performance streetwear for the global underground.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${bebasNeue.variable} font-body bg-background text-on-background antialiased`}>
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
