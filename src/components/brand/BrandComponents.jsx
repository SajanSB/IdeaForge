import React from 'react';
import { IconCheck, IconLoader2, IconAlertCircle, IconHourglass } from '@tabler/icons-react';

// COMP-01: DocTag (UIUX-04 section 2)
export function DocTag({ type, size = 'md', className = '' }) {
  const docToAgent = {
    BRD: 'BA', FRD: 'BA', SRS: 'BA', BMP: 'BA', USR: 'BA',
    PFD: 'BA', UC: 'BA', DMD: 'BA', UAT: 'BA', RTM: 'BA',
    UIUX: 'UX', DEVPROMPT: 'PE', ELICITATION: 'SYS',
  };

  const agentStyles = {
    BA: 'bg-ba-fill border-ba-border text-ba-text',
    UX: 'bg-ux-fill border-ux-border text-ux-text',
    PE: 'bg-pe-fill border-pe-border text-pe-text',
    SYS: 'bg-gray-100 border-gray-300 text-gray-600',
  };

  const agent = docToAgent[type] || 'SYS';
  const sizeStyles = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.75';

  return (
    <span 
      className={`inline-flex items-center font-mono font-medium rounded border-[0.5px] tracking-[0.02em] ${agentStyles[agent]} ${sizeStyles} ${className}`}
      aria-label={`Document type: ${type}`}
    >
      {type}
    </span>
  );
}

// COMP-02: StatusBadge (UIUX-04 section 2)
export function StatusBadge({ status, size = 'md', className = '' }) {
  const statusConfig = {
    complete: { bg: 'bg-[#EAF3DE] text-[#27500A] border-[#97C459]', dot: 'bg-[#639922]', label: 'Complete', icon: IconCheck },
    paid: { bg: 'bg-[#EAF3DE] text-[#27500A] border-[#97C459]', dot: 'bg-[#639922]', label: 'Paid', icon: IconCheck },
    generating: { bg: 'bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]', dot: 'bg-[#378ADD] animate-status-pulse', label: 'Generating', icon: IconLoader2 },
    failed: { bg: 'bg-[#FCEBEB] text-[#791F1F] border-[#F09595]', dot: 'bg-[#E24B4A]', label: 'Failed', icon: IconAlertCircle },
    draft: { bg: 'bg-gray-100 text-gray-600 border-gray-300', dot: 'bg-gray-400', label: 'Draft', icon: IconHourglass },
    pending: { bg: 'bg-gray-100 text-gray-600 border-gray-300', dot: 'bg-gray-400', label: 'Pending', icon: IconHourglass }
  };

  const config = statusConfig[status] || statusConfig.draft;
  const sizeStyles = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.75';
  const Icon = config.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-sans font-medium rounded-full border-[0.5px] ${config.bg} ${sizeStyles} ${className}`}
      aria-label={`Status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {status === 'generating' && <Icon className="w-3 h-3 animate-spin text-[#378ADD]" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}

// COMP-00: MonoId (UIUX-03 section 1.2)
export function MonoId({ children, className = '' }) {
  return (
    <span className={`font-mono text-xs font-medium text-amber-primary tracking-[0.02em] ${className}`}>
      {children}
    </span>
  );
}

// COMP-00: RequirementId (Highlight trace indices in Markdown)
export function RequirementId({ children }) {
  if (typeof children !== 'string') return children;
  
  const regex = /([A-Z]{2,4}-\d{3})/g;
  const parts = children.split(regex);
  
  return (
    <>
      {parts.map((part, i) => {
        if (regex.test(part)) {
          return (
            <span 
              key={i} 
              className="font-mono text-xs font-medium text-amber-primary px-1 bg-amber-tint border-[0.5px] border-amber-border/40 rounded inline-block"
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}
