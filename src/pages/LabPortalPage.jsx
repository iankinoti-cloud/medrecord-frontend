/**
 * PERSON 3 — Lab Technician Portal
 * Replace LabPortalStub with your actual components.
 */
import { PageLayout, PageHeader } from '../components/shared'
import { LabPortalStub } from '../components/lab'

export function LabPortalPage() {
  return (
    <PageLayout>
      <PageHeader title="Lab Portal" subtitle="Upload and manage patient lab results." />
      <LabPortalStub />
    </PageLayout>
  )
}
