import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

const mellos = localFont({
  src: [
    {
      path: "../fonts/Mellos.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Mellos.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

const overcame = localFont({
  src: [
    {
      path: "../fonts/OvercameDemoRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/OvercameDemoBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/OvercameDemoItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/OvercameDemoBoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F7F1" },
    { media: "(prefers-color-scheme: dark)", color: "#040914" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Dream Smith Co-Own",
  description: "Fractional Real Estate Co-Ownership Platform",
  icons: {
    icon: "/images/logo/official-logo-icon.png",
    apple: "/images/logo/official-logo-icon.png",
  },
  verification: {
    google: "google06493120933d599f",
  },
  openGraph: {
    title: "Dream Smith Co-Own",
    description: "Fractional Real Estate Co-Ownership Platform",
    siteName: "Dream Smith Co-Own",
    images: [
      {
        url: "/images/logo/official-logo-full.png",
        width: 1200,
        height: 400,
        alt: "Dream Smith Co-Own",
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/*
          Marks the document as script-capable before first paint, which arms the
          scroll-reveal styles. Without JS the `.js` selector never matches and
          all revealed content renders visible instead of staying transparent.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${mellos.variable} ${overcame.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} antialiased bg-ivory text-ink font-sans selection:bg-gold selection:text-navy-deep`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
