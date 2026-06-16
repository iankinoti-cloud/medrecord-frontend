import { useState } from 'react'
import { StaffTable } from './StaffTable'
import { AuditLogTable } from './AuditLogTable'
import { RegisterPatientForm } from './RegisterPatientForm'
import { LabPortal } from '../lab'

const TABS = [
  { id: 'staff',    label: 'Manage Staff' },
  {id: "lab", label: "Lab Portal"},
  { id: 'audit',    label: 'Security Audit Log' },
  { id: 'register', label: 'Register Patient' },
]

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('staff')

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-cloud rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-surface text-aegean-800 shadow-card'
                : 'text-muted hover:text-midnight'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'staff'    && <StaffTable />}
        {activeTab === "lab"      && <LabPortal />}
        {activeTab === 'audit'    && <AuditLogTable />}
        {activeTab === 'register' && <RegisterPatientForm />}
      </div>
    </div>
  )
}
