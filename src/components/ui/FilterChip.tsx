import clsx from "clsx";

interface FilterChipProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    baseColor: 'gray' | 'green' | 'red' | 'blue';
}

export const FilterChip = ({ label, isActive, onClick, baseColor }: FilterChipProps) => {
    const activeStyle = {
        gray: "bg-slate-900 text-white",
        green: "bg-green-600 text-white",
        red: "bg-red-600 text-white",
        blue: "bg-blue-600 text-white",
    };
    
    const inactiveStyle = {
        gray: "bg-slate-100 text-slate-600 hover:bg-slate-200",
        green: "bg-green-100 text-green-700 hover:bg-green-200",
        red: "bg-red-100 text-red-700 hover:bg-red-200",
        blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    };

    return (
        <button
            onClick={onClick}
            className={clsx(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                isActive ? activeStyle[baseColor] : inactiveStyle[baseColor]
            )}
        >
            {label}
        </button>
    );
};