import type { ReactElement } from "react";

interface SidebarItemProps {
    text: string;
    icon?: ReactElement;        // ✅ optional (for "All")
    onClick: () => void;        // ✅ add click support
    active?: boolean;           // ✅ for highlight
}

export function SidebarItem({ text, icon, onClick, active }: SidebarItemProps) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center text-gray-700 py-2 cursor-pointer rounded max-w-48 pl-4 transition-all duration-150
            ${active ? "bg-purple-100 text-purple-600" : "hover:bg-gray-200"}`}
        >
            {icon && (
                <div className="pr-2">
                    {icon}
                </div>
            )}

            <div>{text}</div>
        </div>
    );
}