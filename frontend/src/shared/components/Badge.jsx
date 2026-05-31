const VARIANTS = {
  accent: 'bg-accent/10 text-accent',
  muted:  'bg-surface text-muted',
};

export function Badge({ children, variant = 'muted', className = '' }) {
  const variantClasses = VARIANTS[variant] ?? VARIANTS.muted;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
