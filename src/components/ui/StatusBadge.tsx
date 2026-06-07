import React from 'react';
import { STATUS_STYLES, STATUS_DOT_STYLES } from '../../constants/oficios';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const badgeStyle = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const dotStyle = STATUS_DOT_STYLES[status] || 'bg-slate-400';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyle}`}></span>
      {status}
    </span>
  );
}
