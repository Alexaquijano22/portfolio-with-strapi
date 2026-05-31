const MESSAGES = {
  network: 'Could not reach the server. Check your connection.',
  client:  'The content could not be loaded (client error).',
  server:  'Server error — please try again later.',
};

function messageFor(type) {
  return MESSAGES[type] ?? 'An unexpected error occurred.';
}

export function ErrorState({ error, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 p-6 text-center text-text"
    >
      <p className="text-muted">{messageFor(error?.type)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-accent px-4 py-2 font-medium text-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Retry
      </button>
    </div>
  );
}

export default ErrorState;
