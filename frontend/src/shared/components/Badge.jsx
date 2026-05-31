const VARIANTS = {
  accent: 'bg-[--color-accent]/10 text-[--color-accent]',
  muted:  'bg-[--color-surface] text-[--color-muted]',
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
