export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}
