import React from "react";

type ListItemProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ListItem({ children, className = "" }: ListItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 flex items-center justify-center">
        <div className="w-2 h-2 bg-slate-600"></div>
      </div>
      <div>
        <p className={className}>{children}</p>
      </div>
    </div>
  );
}
