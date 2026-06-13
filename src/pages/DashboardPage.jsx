/**
 * PERSON 2 — Patient Directory Dashboard
 * Replace DashboardStub with your actual components.
 */
import { PageLayout, PageHeader } from '../components/shared'
import { DashboardStub } from '../components/dashboard'

export function DashboardPage() {
  return (
    <PageLayout>
      <PageHeader title="Patient Directory" subtitle="Search, filter, and manage all patient records." />
      <DashboardStub />
    </PageLayout>
  )
}
