export function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status">
      <div className={`${sizes[size]} border-2 border-border border-t-aegean-700 rounded-full animate-spin`} />
      <span className="text-sm text-muted">{label}</span>
    </div>
  )
}
