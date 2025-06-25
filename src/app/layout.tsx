import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "@/styles/global.scss";

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Complex test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
