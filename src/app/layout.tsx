
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/custom/Navbar';
import { Footer } from '@/components/custom/Footer';

export const metadata: Metadata = {
  title: 'Seating Sage',
  description: 'Smart Seating Plan Generator by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 pb-20"> {/* Adjusted padding for fixed Navbar and Footer */}
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
