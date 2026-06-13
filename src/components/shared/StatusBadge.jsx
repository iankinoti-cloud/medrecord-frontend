const STATUS_STYLES = {
  'Active':      'bg-emerald-100 text-emerald-600 border-emerald-200',
  'In ER':       'bg-coral-100 text-coral-500 border-coral-200',
  'Pending Lab': 'bg-amber-100 text-amber-600 border-amber-200',
  'Discharged':  'bg-gray-100 text-gray-500 border-gray-200',
}

const STATUS_DOTS = {
  'Active':      'bg-emerald-500',
  'In ER':       'bg-coral-500',
  'Pending Lab': 'bg-amber-500',
  'Discharged':  'bg-gray-400',
}

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
  const dot   = STATUS_DOTS[status]   ?? 'bg-gray-400'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}
