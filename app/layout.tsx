import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { GlossaryPanelProvider } from "@/components/GlossaryPanel";
import { PdfViewerProvider } from "@/components/PdfViewer";
import { AiProvider } from "@/lib/ai-context";
import "./globals.css";

const ibmSans = IBM_Plex_Sans({
  variable: "--font-ibm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "EHAC Notes",
  description: "Course notes for EHAC — University of York",
  metadataBase: new URL("https://notes.comr.ie"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${ibmSans.variable} ${ibmMono.variable} font-sans bg-white text-slate-900 antialiased`}
      >
        <GlossaryPanelProvider>
          <PdfViewerProvider>
            <AiProvider>{children}</AiProvider>
          </PdfViewerProvider>
        </GlossaryPanelProvider>
      </body>
    </html>
  );
}
