import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/presentation/providers/ThemeProvider";
import { Header } from "@/presentation/components/layout/Header";
import { Providers } from "@/application/providers/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://spikeclips.com"
  ),
  title: {
    default: "SpikeClip — Find what viewers actually rewatch",
    template: "%s | SpikeClip",
  },
  description:
    "Extract the most-replayed moments from YouTube videos using real audience heatmap data. No AI guesses — just actual viewer behavior.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SpikeClip",
    title: "SpikeClip — Find what viewers actually rewatch",
    description:
      "Extract the most-replayed moments from YouTube videos using real audience heatmap data.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpikeClip — Find what viewers actually rewatch",
    description:
      "Extract the most-replayed moments from YouTube videos using real audience heatmap data.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SpikeClip",
      url: "https://spikeclips.com",
      logo: "https://spikeclips.com/logo.svg",
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
