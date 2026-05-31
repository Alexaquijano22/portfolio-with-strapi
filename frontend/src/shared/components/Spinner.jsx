export function Spinner({ className = '' }) {
  return (
    <div className="flex items-center justify-center p-6" role="status" aria-label="Loading">
      <div
        className={`h-8 w-8 animate-spin rounded-full border-4 border-[--color-surface] border-t-[--color-accent] ${className}`}
      />
    </div>
  );
}

export default Spinner;
