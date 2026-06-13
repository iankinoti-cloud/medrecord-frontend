export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center" role="alert">
      <div className="w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <p className="text-sm text-coral-500 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-aegean-700 hover:text-aegean-800 underline"
        >
          Try again
        </button>
      )}
    </div>
  )
}
