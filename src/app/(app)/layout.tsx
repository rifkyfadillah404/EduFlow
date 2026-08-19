import { Sidebar } from '@/components/layout/sidebar'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-stretch md:flex-row">
      <Sidebar />
      <main className="flex flex-1 min-w-0 flex-col">
        {children}
      </main>
    </div>
  )
}