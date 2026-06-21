import type { Metadata } from "next";
import { Noto_Sans_TC, Outfit } from "next/font/google";
import "./globals.css";
import ApolloProvider from "@/components/ApolloProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevModeBanner from "@/components/DevModeBanner";

const notoTS = Noto_Sans_TC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "蔬食台灣促進會 | Vegetarian Taiwan Promotion Association",
  description: "推廣全民蔬食，建立和平及綠色環保的社會。彰顯蔬食環保意識、愛護動物宣傳。",
  keywords: ["蔬食", "台灣", "環保", "愛護動物", "素食", "公益"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoTS.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ApolloProvider>
          <DevModeBanner />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ApolloProvider>
      </body>
    </html>
  );
}
