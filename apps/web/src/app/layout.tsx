import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpikeClip",
  description:
    "Find what viewers actually rewatch — then make it beautiful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
