import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EQUIAM LinkedIn Graphics Generator',
  description: 'Generate professional deep tech sector visualizations for LinkedIn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
        {children}
      </body>
    </html>
  )
}