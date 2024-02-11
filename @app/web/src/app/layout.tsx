import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from "next/font/google";
import '../styles/globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'aentidade',
  description: 'Site oficial da aentidade'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId={process.env["NEXT_PUBLIC_GA"]} />
    </html>
  )
}
