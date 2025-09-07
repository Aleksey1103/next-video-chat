import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/header/header';
import { ThemeProvider } from '@/components/theme-provider/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'V-chat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased [--header-height:52px]`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header className="h-(--header-height)" />
          <div className="h-[calc(100vh_-_var(--header-height))]">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
