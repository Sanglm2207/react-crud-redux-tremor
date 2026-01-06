import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showBack?: boolean;
  breadcrumbs?: React.ReactNode;
}

export const PageLayout = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  showBack,
  breadcrumbs 
}: PageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {breadcrumbs && (
        <div className="mb-2">
          {breadcrumbs}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8 rounded-full -ml-2" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
            {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
        
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      <div className="min-h-[500px]">
        {children}
      </div>
    </div>
  );
};