const ROLE_STYLES = {
  'Doctor':          'bg-aegean-800 text-white',
  'Lab Technician':  'bg-teal-600 text-white',
  'Admin':           'bg-midnight text-white',
}

export function RoleBadge({ role }) {
  const style = ROLE_STYLES[role] ?? 'bg-gray-500 text-white'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded ${style}`}>
      {role}
    </span>
  )
}
