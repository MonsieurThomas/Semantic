import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Semantic",
  description: "Semantic",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log("Layout");
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
