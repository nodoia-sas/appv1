"use client";

import React from "react";
import {
  ChevronRightIcon,
  HomeIcon,
  UserIcon,
  FileTextIcon,
  FileIcon,
  CarIcon,
  NewspaperIcon,
  BookOpenIcon,
  BookIcon,
  HelpCircleIcon,
  MessageSquareIcon,
  BotIcon,
  ConstructionIcon,
  ScrollIcon,
} from "lucide-react";
import { useNavigation } from "@/lib/navigation";
import { cn } from "@/shared/utils";

// Icon mapping for breadcrumb icons
const ICON_MAP = {
  home: HomeIcon,
  user: UserIcon,
  "file-text": FileTextIcon,
  file: FileIcon,
  car: CarIcon,
  newspaper: NewspaperIcon,
  article: NewspaperIcon,
  "book-open": BookOpenIcon,
  scroll: ScrollIcon,
  book: BookIcon,
  "help-circle": HelpCircleIcon,
  "message-square": MessageSquareIcon,
  bot: BotIcon,
  construction: ConstructionIcon,
};

interface BreadcrumbSystemProps {
  className?: string;
  showHomeIcon?: boolean;
  showIcons?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
}

/**
 * BreadcrumbSystem - Automatic breadcrumb navigation component
 *
 * Generates breadcrumbs automatically based on the current route and provides
 * navigation functionality. Responsive design collapses on mobile devices.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
export function BreadcrumbSystem({
  className,
  showHomeIcon = true,
  showIcons = true,
  maxItems = 4,
  separator,
}: BreadcrumbSystemProps) {
  const { breadcrumbs, navigate } = useNavigation();

  // Don't render if no breadcrumbs or only home
  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  // Handle breadcrumb click navigation
  const handleBreadcrumbClick = (path: string, index: number) => {
    // Don't navigate if it's the current page (last item)
    if (index === breadcrumbs.length - 1) {
      return;
    }

    // Navigate to the selected breadcrumb
    navigate(path);
  };

  // Get icon component for breadcrumb
  const getIconComponent = (iconName?: string) => {
    if (!iconName || !showIcons) return null;
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP];
    return IconComponent ? (
      <IconComponent className="h-4 w-4 shrink-0" />
    ) : null;
  };

  // Truncate breadcrumbs if they exceed maxItems
  const displayBreadcrumbs =
    breadcrumbs.length > maxItems
      ? [
          breadcrumbs[0], // Always show home
          { label: "...", path: "", icon: "" }, // Ellipsis
          ...breadcrumbs.slice(-2), // Show last 2 items
        ]
      : breadcrumbs;

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-gray-600 py-2 px-4 bg-white",
        "overflow-x-auto scrollbar-hide", // Mobile scroll
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1 min-w-0">
        {displayBreadcrumbs.map((crumb, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = crumb.label === "...";
          const isHome = index === 0;

          return (
            <li key={`${crumb.path}-${index}`} className="flex items-center">
              {/* Separator (not for first item) */}
              {index > 0 && (
                <span className="mx-1 text-gray-400 shrink-0">
                  {separator || <ChevronRightIcon className="h-4 w-4" />}
                </span>
              )}

              {/* Breadcrumb item */}
              {isEllipsis ? (
                <span className="text-gray-400 px-1">...</span>
              ) : (
                <button
                  onClick={() => handleBreadcrumbClick(crumb.path, index)}
                  disabled={isLast}
                  className={cn(
                    "flex items-center space-x-1 rounded px-2 py-1 transition-colors",
                    "min-w-0 shrink-0", // Prevent text overflow
                    isLast
                      ? "text-gray-900 font-medium cursor-default"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                  )}
                  aria-current={isLast ? "page" : undefined}
                  title={crumb.label}
                >
                  {/* Icon for breadcrumb item - show on desktop and for last item on mobile */}
                  <span className="hidden sm:inline">
                    {getIconComponent(crumb.icon)}
                  </span>

                  {/* Show icon on mobile only for last item, or for non-last items without text */}
                  {(isLast || !crumb.label) && (
                    <span className="sm:hidden">
                      {getIconComponent(crumb.icon)}
                    </span>
                  )}

                  {/* Breadcrumb label */}
                  <span
                    className={cn(
                      "truncate",
                      // Hide text on mobile for non-last items to save space
                      "hidden sm:inline",
                      isLast && "inline" // Always show last item text
                    )}
                  >
                    {crumb.label}
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Compact version for mobile/small spaces
 */
export function CompactBreadcrumbSystem({ className }: { className?: string }) {
  const { breadcrumbs, navigate } = useNavigation();

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const parentPage =
    breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  return (
    <nav
      className={cn("flex items-center text-sm bg-white", className)}
      aria-label="Breadcrumb"
    >
      {parentPage && (
        <>
          <button
            onClick={() => navigate(parentPage.path)}
            className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180 mr-1" />
            {parentPage.label}
          </button>
          <span className="mx-2 text-gray-400">/</span>
        </>
      )}
      <span className="text-gray-900 font-medium truncate">
        {currentPage.label}
      </span>
    </nav>
  );
}

export default BreadcrumbSystem;
