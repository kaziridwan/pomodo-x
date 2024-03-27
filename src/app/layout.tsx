import type { Metadata } from 'next'
import { Provider as JotaiProvider } from 'jotai'

import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'POMODO-X',
  description: 'Your fav beats on pomodoro',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JotaiProvider>
          {children}
        </JotaiProvider>
      </body>
    </html>
  )
}
