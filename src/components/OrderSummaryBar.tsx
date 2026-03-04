interface Props {
  total: number
  itemCount: number
  onSubmit: () => void
  disabled: boolean
  loading: boolean
}

export default function OrderSummaryBar({
  total,
  itemCount,
  onSubmit,
  disabled,
  loading,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-onyx-900/95 backdrop-blur-md border-t border-onyx-800 p-4">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-onyx-500 uppercase tracking-wider">
            {itemCount} article{itemCount > 1 ? 's' : ''}
          </p>
          <p className="text-xl font-display font-light text-champagne-400 tabular-nums">
            {total.toFixed(2)} &euro;
          </p>
        </div>
        <button
          onClick={onSubmit}
          disabled={disabled || loading}
          className={`px-8 py-3 rounded-lg text-sm tracking-wider uppercase transition-all duration-300
            ${
              disabled
                ? 'bg-onyx-800 text-onyx-600 cursor-not-allowed'
                : 'bg-champagne-500 text-onyx-900 font-semibold hover:bg-champagne-400 active:scale-[0.97]'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Envoi
            </span>
          ) : (
            'Commander'
          )}
        </button>
      </div>
    </div>
  )
}
