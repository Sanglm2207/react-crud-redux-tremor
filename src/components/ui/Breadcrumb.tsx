import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import clsx from "clsx";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export default function Breadcrumb({ 
  items, 
  showHome = true, 
  className 
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={clsx("flex", className)}>
      <ol className="flex items-center space-x-2">
        {showHome && (
          <li>
            <Link 
              to="/" 
              className="text-gray-400 hover:text-blue-600 transition-colors flex items-center"
            >
              <Home size={18} />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0 && !showHome;

          return (
            <li key={index} className="flex items-center">
              {/* Separator Icon */}
              {(!isFirst || showHome) && (
                <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400 mx-1" />
              )}

             {isLast || !item.to ? (
                // Item cuối cùng hoặc không có link -> Text tĩnh (Active)
                <span 
                  className="text-sm font-medium text-gray-900 truncate max-w-[200px] md:max-w-none" 
                  aria-current="page"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                // Item có link -> Link
                <Link
                  to={item.to}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors truncate max-w-[150px] md:max-w-none"
                  title={item.label}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}