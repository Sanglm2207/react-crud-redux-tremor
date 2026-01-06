import clsx from "clsx";

type ColorType = "blue" | "green" | "red" | "yellow" | "gray" | "purple";

interface ChipProps {
  children: React.ReactNode;
  color?: ColorType;
  className?: string;
}

const colorStyles: Record<ColorType, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-700 border-red-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  gray: "bg-slate-100 text-slate-700 border-slate-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

export const Chip = ({ children, color = "gray", className }: ChipProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colorStyles[color],
        className
      )}
    >
      {children}
    </span>
  );
};