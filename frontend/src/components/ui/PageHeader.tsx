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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        {badge && (
          <div className="flex items-center gap-1.5 mb-1.5">
            {badgeIcon}
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              {badge}
            </span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
