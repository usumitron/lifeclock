import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: "Life Clock",
  description: "生まれてからの経過時間を表示するアプリ",
  manifest: "/manifest.json", // 追加
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Life Clock",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

const inter = Inter({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}