type IconProps = {
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconStrategy({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="6" />
      <path d="M16 5v3M27 16h-3M16 27v-3M5 16h3" />
    </svg>
  );
}

export function IconDesign({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <rect x="5" y="5" width="22" height="16" rx="1.5" />
      <path d="M5 10h22" />
      <circle cx="9" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11 25h10M16 21v4" />
    </svg>
  );
}

export function IconCode({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <path d="M12 10 6 16l6 6M20 10l6 6-6 6M18 8l-4 16" />
    </svg>
  );
}

export function IconCloud({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <path d="M9 22a5.5 5.5 0 0 1-.6-10.97A6.5 6.5 0 0 1 21 9.8a5 5 0 0 1 1.9 9.7" />
      <path d="M9 22h13.5" />
    </svg>
  );
}

export function IconData({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <ellipse cx="16" cy="8" rx="9" ry="3.2" />
      <path d="M7 8v8c0 1.77 4.03 3.2 9 3.2s9-1.43 9-3.2V8" />
      <path d="M7 16v8c0 1.77 4.03 3.2 9 3.2s9-1.43 9-3.2v-8" />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <path d="M16 5l10 3.6v7.2c0 6.2-4.2 9.9-10 11.2-5.8-1.3-10-5-10-11.2V8.6L16 5z" />
      <path d="M11.5 16l3 3 6-6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowDown({ className }: IconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Shaft: perfectly centered */}
      <path d="M12 5v14" />
      {/* Arrowhead: 45-degree angles pointing down */}
      <path d="M6 13l6 6 6-6" />
    </svg>
  );
}

export function IconPlane({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <path d="M27 5 5 15.5l9 2.5L27 5Z" />
      <path d="M14 18l2 9 3-6" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M4 6.5l8 6 8-6" />
    </svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6.5 3.5h3l1.5 4-2 2a11 11 0 0 0 5.5 5.5l2-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function IconWhatsApp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M8.5 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.6.7c.7 1.3 1.7 2.3 3 3l.7-.6c.2-.2.4-.2.7-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1 .3-1.4.2-2.2-.5-5-3.3-5.5-5.5-.1-.5 0-1 .1-1.5Z" />
    </svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function IconLinkedIn({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.98 1.83-2.02 3.77-2.02 4.03 0 4.78 2.53 4.78 5.83V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21h-4V9Z" />
    </svg>
  );
}

export function IconTwitter({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.9 3h3.1l-6.8 7.8L23 21h-6.3l-4.9-6.4L6.2 21H3.1l7.3-8.3L2 3h6.4l4.4 5.8L18.9 3Zm-1.1 16.2h1.7L7.3 4.7H5.5l12.3 14.5Z" />
    </svg>
  );
}

export function IconInstagram({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}
