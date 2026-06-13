import { Sidebar } from './Sidebar'

export function PageLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-cloud">
      <Sidebar />
      <main className="flex-1 p-8" style={{ marginLeft: 'var(--sidebar-width)' }}>
        {children}
      </main>
    </div>
  )
}
