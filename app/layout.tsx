import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dinner Invite",
  description: "A playful, low-pressure dinner invitation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {children}
      </body>
    </html>
  );
}
