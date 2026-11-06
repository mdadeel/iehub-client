import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * Institutional Bilateral Trade Logo & Mark for IEHUB
 * - Left Inbound Vector (White/Platinum): Import pillar ('I')
 * - Right Outbound Vector (Maritime Crimson): Export hub ('E')
 * - Negative space bridge: Central Trade Node ('H' - Hub)
 */
export function LogoMark({ className, size = 32 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0 transition-transform duration-200 group-hover:scale-105", className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="iehub-crimson-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0433F" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="iehub-base-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#161B20" />
          <stop offset="100%" stopColor="#080A0C" />
        </linearGradient>
      </defs>

      {/* Base Squircle Tile */}
      <rect width="64" height="64" rx="14" fill="url(#iehub-base-dark)" />
      <rect
        x="0.75"
        y="0.75"
        width="62.5"
        height="62.5"
        rx="13.25"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth="1.5"
      />

      {/* Inbound Trade Pillar: 'I' (Import) */}
      <path d="M14 16 H24 V48 H14 Z" fill="#FFFFFF" />

      {/* Central Inbound Directional Vector */}
      <path d="M24 26 L32 32 L24 38 Z" fill="#FFFFFF" />

      {/* Outbound Trade Frame: 'E' (Export) */}
      <path
        d="M33 16 H50 V24 H41 V28 H47 V36 H41 V40 H50 V48 H33 Z"
        fill="url(#iehub-crimson-grad)"
      />

      {/* Directional Outbound Arrowhead */}
      <path d="M47 28 L54 32 L47 36 Z" fill="#F0433F" />
    </svg>
  );
}

export default function Logo({
  variant = 'full',
  size = 'md',
  overHero = false,
  to = '/',
  className,
}) {
  const pixelSizes = {
    sm: 26,
    md: 32,
    lg: 40,
    xl: 48,
  };

  const markSize = pixelSizes[size] || 32;

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <LogoMark size={markSize} />
      {variant !== 'mark' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-display font-extrabold tracking-tight transition-colors",
                size === 'sm' && "text-[14px]",
                size === 'md' && "text-[16px]",
                size === 'lg' && "text-[20px]",
                size === 'xl' && "text-[24px]",
                overHero ? "text-white" : "text-foreground group-hover:text-accent-primary"
              )}
            >
              IEHUB
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          </div>
          <span
            className={cn(
              "font-mono font-semibold uppercase tracking-[0.20em]",
              size === 'sm' && "text-[7.5px] mt-0.5",
              size === 'md' && "text-[8.5px] mt-1",
              size === 'lg' && "text-[10px] mt-1",
              size === 'xl' && "text-[11px] mt-1",
              overHero ? "text-white/55" : "text-foreground-subtle"
            )}
          >
            Trade network
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="shrink-0 focus:outline-none" aria-label="IEHUB Trade OS Home">
        {content}
      </Link>
    );
  }

  return content;
}

