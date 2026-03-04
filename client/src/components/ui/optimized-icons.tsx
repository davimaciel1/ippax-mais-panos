import React from 'react'

// Custom optimized icons - only the ones we actually use
// This dramatically reduces bundle size vs importing all of lucide-react

interface IconProps {
  className?: string
  size?: number
  strokeWidth?: number
  'aria-hidden'?: boolean
}

// Shopping Bag Icon (used in navigation)
export const ShoppingBag: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M16 10a4 4 0 0 1-8 0" />
    <path d="M3.103 6.034h17.794" />
    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
  </svg>
)

// User Icon
export const User: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// UserCheck Icon (for authenticated users)
export const UserCheck: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="m17 11 2 2 4-4" />
  </svg>
)

// Menu Icon
export const Menu: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

// Mail Icon
export const Mail: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="M22 7l-10 5L2 7" />
  </svg>
)

// MessageSquare Icon
export const MessageSquare: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

// X Icon (close)
export const X: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
)

// Phone Icon
export const Phone: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

// ArrowRight Icon
export const ArrowRight: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

// Star Icon
export const Star: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

// Shield Icon
export const Shield: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

// Target Icon
export const Target: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

// Truck Icon
export const Truck: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h2" />
    <path d="M19 18h2c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1h-2" />
    <path d="M21 6H3" />
    <path d="M21 18H3" />
    <circle cx="8" cy="21" r="2" />
    <circle cx="16" cy="21" r="2" />
  </svg>
)
// CreditCard Icon
export const CreditCard: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="m2 10 20 0" />
  </svg>
)

// TrendingUp Icon
export const TrendingUp: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
)

// Award Icon
export const Award: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
)

// Volume2 Icon (for benefits section)
export const Volume2: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
)

// Thermometer Icon
export const Thermometer: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
)

// Droplets Icon
export const Droplets: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2.04 4.6 4.14 5.93a10.94 10.94 0 0 1 2.73 3.4 6.06 6.06 0 0 1 .84 3.12c0 3.32-2.69 6.02-6 6.02a5.93 5.93 0 0 1-4.3-1.88" />
  </svg>
)

// Sparkles Icon
export const Sparkles: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
)

// Package Icon
export const Package: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29,7 12,12 20.71,7" />
    <line x1="12" x2="12" y1="22" y2="12" />
  </svg>
)

// Zap Icon
export const Zap: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
)

// Leaf Icon
export const Leaf: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

// Clock Icon
export const Clock: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

// ThumbsUp Icon
export const ThumbsUp: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
)

// Users Icon
export const Users: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

// ShoppingCart Icon
export const ShoppingCart: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
)

// Loader2 Icon
export const Loader2: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

// XCircle Icon
export const XCircle: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
)

// Store Icon
export const Store: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M2 7v1l2 12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2L22 8V7" />
    <path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
    <circle cx="12" cy="13" r="1" />
  </svg>
)

// Home Icon
export const Home: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
)

// Check Icon
export const Check: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m9 12 2 2 4-4" />
  </svg>
)

// ChevronDown Icon
export const ChevronDown: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

// ChevronUp Icon
export const ChevronUp: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
)

// Calculator Icon
export const Calculator: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="m9 10 2 2 4-4" />
  </svg>
)

// Calendar Icon
export const Calendar: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

// Palette Icon
export const Palette: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
)

// AlertCircle Icon
export const AlertCircle: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

// AlertTriangle Icon
export const AlertTriangle: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="m12 17 .01 0" />
  </svg>
)

// Trash2 Icon
export const Trash2: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

// Plus Icon
export const Plus: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

// Minus Icon
export const Minus: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M5 12h14" />
  </svg>
)

// ArrowLeft Icon
export const ArrowLeft: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

// ArrowLeftRight Icon
export const ArrowLeftRight: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </svg>
)

// Bed Icon
export const Bed: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
  </svg>
)

// Building Icon
export const Building: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
)

// Heart Icon
export const Heart: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
  </svg>
)

// ExternalLink Icon
export const ExternalLink: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

// Building2 Icon
export const Building2: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
)

// Quote Icon
export const Quote: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
)

// BookOpen Icon
export const BookOpen: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

// Instagram Icon
export const Instagram: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

// Facebook Icon
export const Facebook: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

// Linkedin Icon
export const Linkedin: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

// Youtube Icon
export const Youtube: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
)

// MapPin Icon
export const MapPin: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// Send Icon
export const Send: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4z" />
  </svg>
)

// Search Icon
export const Search: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

// Filter Icon
export const Filter: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
)

// Share2 Icon
export const Share2: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
)

// Twitter Icon
export const Twitter: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

// Tag Icon
export const Tag: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.828 8.828a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
)

// Bell Icon
export const Bell: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

// Settings Icon
export const Settings: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// BarChart Icon
export const BarChart: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
)

// ArrowUpRight Icon
export const ArrowUpRight: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m7 17 10-10" />
    <path d="M7 7h10v10" />
  </svg>
)

// ArrowDownRight Icon
export const ArrowDownRight: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m7 7 10 10" />
    <path d="M17 7v10H7" />
  </svg>
)

// Activity Icon
export const Activity: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

// Eye Icon
export const Eye: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// DollarSign Icon
export const DollarSign: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

// FileText Icon
export const FileText: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <line x1="10" x2="16" y1="13" y2="13" />
    <line x1="10" x2="16" y1="17" y2="17" />
    <line x1="10" x2="13" y1="9" y2="9" />
  </svg>
)

// Download Icon
export const Download: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

// Edit Icon
export const Edit: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

// Printer Icon
export const Printer: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <polyline points="6,9 6,2 18,2 18,9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
)

// MoreHorizontal Icon
export const MoreHorizontal: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

// CheckCircle2 Icon
export const CheckCircle2: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

// Save Icon
export const Save: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
)

// Upload Icon
export const Upload: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)

// Image Icon
export const Image: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
)

// Video Icon
export const Video: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
)

// Globe Icon
export const Globe: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

// BarChart3 Icon
export const BarChart3: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
)

// Info Icon
export const Info: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

// List Icon
export const List: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <line x1="8" x2="21" y1="6" y2="6" />
    <line x1="8" x2="21" y1="12" y2="12" />
    <line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" />
    <line x1="3" x2="3.01" y1="12" y2="12" />
    <line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
)

// Code Icon
export const Code: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
)

// RotateCcw Icon
export const RotateCcw: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

// History Icon
export const History: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
)

// ArrowUp Icon
export const ArrowUp: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
)

// ArrowDown Icon
export const ArrowDown: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
)

// TrendingDown Icon
export const TrendingDown: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" />
    <polyline points="16,17 22,17 22,11" />
  </svg>
)

// PieChart Icon
export const PieChart: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
)

// LineChart Icon
export const LineChart: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
)

// MousePointer Icon
export const MousePointer: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <path d="m13 13 6 6" />
  </svg>
)

// Smartphone Icon
export const Smartphone: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <line x1="12" x2="12.01" y1="18" y2="18" />
  </svg>
)

// Monitor Icon
export const Monitor: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="20" height="14" x="2" y="3" rx="2" ry="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
)

// Tablet Icon
export const Tablet: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <line x1="12" x2="12.01" y1="18" y2="18" />
  </svg>
)

// RefreshCw Icon
export const RefreshCw: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
)

// Edit2 Icon
export const Edit2: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
)

// LogOut Icon
export const LogOut: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

// Lock Icon
export const Lock: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

// CheckCircle Icon
export const CheckCircle: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
)

// ShieldCheck Icon
export const ShieldCheck: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

// Circle Icon
export const Circle: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
)

// UserPlus Icon
export const UserPlus: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  'aria-hidden': ariaHidden = true 
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
)

// Export all icons as a bundle for easy importing
export const OptimizedIcons = {
  ShoppingBag,
  User,
  UserCheck,
  Menu,
  X,
  XCircle,
  Phone,
  ArrowRight,
  Star,
  Shield,
  Target,
  Truck,
  CreditCard,
  TrendingUp,
  Award,
  Volume2,
  Thermometer,
  Droplets,
  Sparkles,
  Package,
  Zap,
  Leaf,
  Clock,
  ThumbsUp,
  Users,
  ShoppingCart,
  Loader2,
  Mail,
  MessageSquare,
  Store,
  Home,
  Check,
  ChevronDown,
  ChevronUp,
  Calculator,
  Calendar,
  Palette,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowLeftRight,
  Bed,
  Building,
  Heart,
  ExternalLink,
  Building2,
  Quote,
  BookOpen,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MapPin,
  Send,
  Search,
  Filter,
  Share2,
  Twitter,
  Tag,
  Bell,
  Settings,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  DollarSign,
  FileText,
  Download,
  Edit,
  Printer,
  MoreHorizontal,
  CheckCircle2,
  Save,
  Upload,
  Image,
  Video,
  Globe,
  BarChart3,
  Info,
  List,
  Code,
  RotateCcw,
  History,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  PieChart,
  LineChart,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Edit2,
  LogOut,
  Lock,
  CheckCircle,
  ShieldCheck,
  Circle,
  UserPlus
}

export default OptimizedIcons
