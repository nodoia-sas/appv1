/**
 * OptimizedLink Component
 *
 * Enhanced Next.js Link component with intelligent prefetching,
 * hover effects, and performance optimizations.
 *
 * Requirements: 12.1, 12.2, 12.3
 */

"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import {
  useHoverPrefetch,
  useViewportPrefetch,
  PrefetchConfig,
} from "./prefetch";
import { cn } from "@/lib/utils";

export interface OptimizedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The route to navigate to */
  href: string;
  /** Children to render inside the link */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Prefetch configuration */
  prefetch?: PrefetchConfig;
  /** Whether to replace the current history entry */
  replace?: boolean;
  /** Whether to scroll to top after navigation */
  scroll?: boolean;
  /** Whether to enable viewport-based prefetching */
  viewportPrefetch?: boolean;
  /** Whether to enable hover-based prefetching */
  hoverPrefetch?: boolean;
  /** Custom prefetch priority */
  priority?: "high" | "low";
}

/**
 * OptimizedLink - Enhanced Link component with performance optimizations
 *
 * Features:
 * - Intelligent hover-based prefetching with configurable delay
 * - Viewport-based prefetching for links in view
 * - Automatic code splitting optimization
 * - Configurable prefetch strategies
 */
export const OptimizedLink = forwardRef<HTMLAnchorElement, OptimizedLinkProps>(
  (
    {
      href,
      children,
      className,
      prefetch = {},
      replace = false,
      scroll = true,
      viewportPrefetch = true,
      hoverPrefetch = true,
      priority = "low",
      ...props
    },
    ref
  ) => {
    // Configure prefetch settings
    const prefetchConfig: PrefetchConfig = {
      onHover: hoverPrefetch,
      onViewport: viewportPrefetch,
      priority,
      ...prefetch,
    };

    // Get hover prefetch handlers
    const hoverHandlers = useHoverPrefetch(href, prefetchConfig);

    // Get viewport prefetch ref
    const { ref: viewportRef } = useViewportPrefetch(href, prefetchConfig);

    // Combine refs if viewport prefetching is enabled
    const combinedRef = React.useCallback(
      (node: HTMLAnchorElement | null) => {
        // Set viewport ref for intersection observer
        if (viewportPrefetch && viewportRef) {
          (
            viewportRef as React.MutableRefObject<HTMLAnchorElement | null>
          ).current = node;
        }

        // Set forwarded ref
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, viewportRef, viewportPrefetch]
    );

    // Combine hover handlers with existing props
    const combinedProps = {
      ...props,
      ...(hoverPrefetch ? hoverHandlers : {}),
      className: cn(
        // Base link styles for better UX
        "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm",
        className
      ),
    };

    return (
      <Link
        href={href}
        replace={replace}
        scroll={scroll}
        prefetch={false} // We handle prefetching manually for better control
        ref={combinedRef}
        {...combinedProps}
      >
        {children}
      </Link>
    );
  }
);

OptimizedLink.displayName = "OptimizedLink";

/**
 * High-priority link for critical navigation paths
 */
export const HighPriorityLink = forwardRef<
  HTMLAnchorElement,
  OptimizedLinkProps
>((props, ref) => (
  <OptimizedLink
    {...props}
    ref={ref}
    priority="high"
    prefetch={{
      hoverDelay: 50, // Faster prefetch for high-priority links
      priority: "high",
      ...props.prefetch,
    }}
  />
));

HighPriorityLink.displayName = "HighPriorityLink";

/**
 * Navigation link optimized for menu items and navigation bars
 */
export const NavLink = forwardRef<HTMLAnchorElement, OptimizedLinkProps>(
  ({ className, ...props }, ref) => (
    <OptimizedLink
      {...props}
      ref={ref}
      className={cn(
        // Navigation-specific styles
        "block px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
      prefetch={{
        hoverDelay: 150, // Slightly longer delay for nav items
        onViewport: false, // Don't prefetch nav items on viewport (they're always visible)
        ...props.prefetch,
      }}
    />
  )
);

NavLink.displayName = "NavLink";

export default OptimizedLink;
