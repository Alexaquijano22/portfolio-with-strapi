export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-[--color-surface] border border-[--color-border] rounded-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
