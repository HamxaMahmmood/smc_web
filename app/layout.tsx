import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siddique Medical Complex",
  description: "Patient Management System — Dr. Zahid Mahmood",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
