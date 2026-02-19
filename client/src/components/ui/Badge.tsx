export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 ${className}`}>
      {children}
    </span>
  );
}
