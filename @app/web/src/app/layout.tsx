import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <script
        type="module"
        defer
        src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/spiral.js"
      ></script>

      <body>{children}</body>
    </html>
  )
}
