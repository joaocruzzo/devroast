import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { Navbar } from "@/components/ui/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "devroast",
  description: "Paste your code. Get roasted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-page">
        <Navbar
          logo="devroast"
          links={[{ label: "leaderboard", href: "/leaderboard" }]}
        />
        <Providers>
          <main className="mx-auto px-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
