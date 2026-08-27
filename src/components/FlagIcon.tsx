const FLAGS: Record<string, React.ReactNode> = {
  fr: (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#fff" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h60v30H0z" fill="#00247d" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#cf142b" strokeWidth="3" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="0.667" x="0" y="0" fill="#000" />
      <rect width="3" height="0.667" x="0" y="0.667" fill="#DD0000" />
      <rect width="3" height="0.667" x="0" y="1.333" fill="#FFCE00" />
    </svg>
  ),
  es: (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="0.5" x="0" y="0" fill="#AA151B" />
      <rect width="3" height="1" x="0" y="0.5" fill="#F1BF00" />
      <rect width="3" height="0.5" x="0" y="1.5" fill="#AA151B" />
    </svg>
  ),
};

export default function FlagIcon({ code, className = "" }: { code: string; className?: string }) {
  return (
    <span
      className={`inline-block h-3.5 w-5 overflow-hidden rounded-[3px] border border-black/10 [&>svg]:h-full [&>svg]:w-full [&>svg]:block ${className}`}
    >
      {FLAGS[code]}
    </span>
  );
}
