// Badge component untuk tampilkan status

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "yellow" | "red" | "indigo" | "slate";
}

export function Badge({ children, variant = "slate" }: BadgeProps) {
  const variants = {
    green:  "badge-green",
    yellow: "badge-yellow",
    red:    "badge-red",
    indigo: "badge-indigo",
    slate:  "badge bg-slate-700/50 text-slate-300 border border-slate-600",
  };

  return (
    <span className={variants[variant]}>
      {children}
    </span>
  );
}