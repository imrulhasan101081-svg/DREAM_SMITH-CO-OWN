import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const ibmPlexMono = IBM_Plex_Mono({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-ibm-plex-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Dream Smith Co-Own",
  description: "Fractional Real Estate Co-Ownership Platform",
  icons: {
    icon: "/images/logo/official-logo-icon.png",
    apple: "/images/logo/official-logo-icon.png",
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
        className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable} antialiased bg-ivory text-ink font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
