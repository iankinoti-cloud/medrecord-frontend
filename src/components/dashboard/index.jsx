/**
 * PERSON 2 — Patient Directory / Dashboard
 * Build your components here and export them from this file.
 *
 * Required exports:
 *   StatCard, PatientTable, SearchBar, Pagination
 *
 * Import shared components from: import { Sidebar, StatusBadge, PageHeader } from '../shared'
 * Backend endpoint: GET /patients?search=&page=&limit=
 */

export function DashboardStub() {
  return (
    <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border">
      <div className="text-center">
        <p className="text-sm font-medium text-midnight">Person 2 — Patient Directory</p>
        <p className="text-xs text-muted mt-1">Build components in src/components/dashboard/</p>
      </div>
    </div>
  )
}
