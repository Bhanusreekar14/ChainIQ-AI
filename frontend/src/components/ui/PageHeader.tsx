import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  badgeIcon,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div>
        {badge && (
          <div className="flex items-center gap-1.5 mb-1">
            {badgeIcon}
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              {badge}
            </span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
