import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import '@/app/globals.css'

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'EduFlow - Mini LMS',
  description: 'A portfolio learning management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kanit.variable} font-sans antialiased min-h-screen flex flex-col grid-bg-dark`}>
        {children}
      </body>
    </html>
  )
}