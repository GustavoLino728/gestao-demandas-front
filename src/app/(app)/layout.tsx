import type { ReactNode } from 'react'
import { QueryProvider } from '@/components/providers/QueryProvider'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-[#f7f7f8]">{children}</div>
    </QueryProvider>
  )
}