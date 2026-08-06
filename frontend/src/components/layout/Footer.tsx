import React from 'react';
import { APP_THEME } from '../../constants/theme';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">{APP_THEME.brandName}</span>
          <span>— {APP_THEME.subheading}</span>
        </div>
        <div>
          <span>{APP_THEME.version} • FastAPI &amp; CatBoost ML Engine</span>
        </div>
      </div>
    </footer>
  );
};
