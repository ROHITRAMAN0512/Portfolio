import type { ReactNode } from 'react'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  disabled?: boolean
  external?: boolean
  className?: string
  children: ReactNode
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-accent text-bg hover:bg-[#5eead4]',
  secondary: 'border border-line text-text hover:border-accent/60 hover:text-accent',
}

export function Button({
  href,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  external,
  className = '',
  children,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
