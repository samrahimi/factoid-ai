import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./new.css";

import LayoutWrapper from './LayoutWrapper';
import LayoutWrapperCodeOnly from './LayoutWrapperCodeOnly';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeFact - Fact Checking, Research, and Journalism at Scale",
  description: "Our state of the art, massive Mixture-of-Experts, internet-connected AI model can perform research of all sorts and check facts professionally and at scale. It is also capable of performing human-quality journalism and scholarly research.",
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
