import { PageLayout, PageHeader } from '../components/shared'
import { AdminPanel } from '../components/admin/AdminPanel'

export function AdminPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Admin Panel"
        subtitle="Manage staff accounts, patient registration, and security audit trail."
      />
      <AdminPanel />
    </PageLayout>
  )
}
