import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./new.css";

import LayoutWrapper from './LayoutWrapper';
import LayoutWrapperCodeOnly from './LayoutWrapperCodeOnly';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Factoid - Fact Checking, Research, and Journalism",
  description: "Uses search-enabled LLMs to check facts professionally and at scale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className+" dark"}>
        <LayoutWrapperCodeOnly>{children}</LayoutWrapperCodeOnly>
      </body>
    </html>
  );
}
