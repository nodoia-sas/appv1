/**
 * Image Optimization Utilities
 *
 * Provides optimized image loading, lazy loading, and responsive
 * image handling for better performance across routes.
 *
 * Requirements: 12.4, 12.5, 12.6
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Image optimization configuration
export interface ImageOptimizationConfig {
  /** Enable lazy loading */
  lazy?: boolean;
  /** Intersection threshold for lazy loading */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Placeholder while loading */
  placeholder?: string;
  /** Error fallback image */
  fallback?: string;
  /** Quality for optimized images */
  quality?: number;
  /** Responsive breakpoints */
  breakpoints?: number[];
}

// Default configuration
const DEFAULT_CONFIG: Required<ImageOptimizationConfig> = {
  lazy: true,
  threshold: 0.1,
  rootMargin: "50px",
  placeholder:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+",
  fallback: "/placeholder.svg",
  quality: 75,
  breakpoints: [640, 768, 1024, 1280, 1536],
};

/**
 * Hook for lazy image loading with intersection observer
 */
export function useLazyImage(
  src: string,
  config: ImageOptimizationConfig = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!finalConfig.lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!finalConfig.lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: finalConfig.threshold,
        rootMargin: finalConfig.rootMargin,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [
    finalConfig.lazy,
    finalConfig.threshold,
    finalConfig.rootMargin,
    isInView,
  ]);

  // Handle image load and error events
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  // Determine which src to use
  const imageSrc = hasError
    ? finalConfig.fallback
    : isInView
    ? src
    : finalConfig.placeholder;

  return {
    ref: imgRef,
    src: imageSrc,
    isLoaded,
    isInView,
    hasError,
    onLoad: handleLoad,
    onError: handleError,
  };
}

/**
 * Generate responsive image srcSet for different breakpoints
 */
export function generateSrcSet(
  baseSrc: string,
  breakpoints: number[] = DEFAULT_CONFIG.breakpoints,
  quality: number = DEFAULT_CONFIG.quality
): string {
  return breakpoints
    .map((width) => {
      // For Next.js Image optimization API
      const optimizedSrc = `${baseSrc}?w=${width}&q=${quality}`;
      return `${optimizedSrc} ${width}w`;
    })
    .join(", ");
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => {
      if (breakpoint === "default") {
        return size;
      }
      return `(max-width: ${breakpoint}) ${size}`;
    })
    .join(", ");
}

/**
 * Preload critical images
 */
export function preloadImage(
  src: string,
  priority: "high" | "low" = "low"
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));

    // Set priority for browser optimization
    if (priority === "high") {
      img.fetchPriority = "high";
    }

    img.src = src;
  });
}

/**
 * Preload multiple images with progress tracking
 */
export function preloadImages(
  sources: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void[]> {
  let loaded = 0;

  const promises = sources.map((src) =>
    preloadImage(src).then(() => {
      loaded++;
      onProgress?.(loaded, sources.length);
    })
  );

  return Promise.all(promises);
}

/**
 * Hook for image preloading with progress
 */
export function useImagePreloader(sources: string[]) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  const preload = useCallback(async () => {
    try {
      setProgress(0);
      setIsComplete(false);
      setHasError(false);

      await preloadImages(sources, (loaded, total) => {
        setProgress((loaded / total) * 100);
      });

      setIsComplete(true);
    } catch (error) {
      console.error("Image preloading failed:", error);
      setHasError(true);
    }
  }, [sources]);

  return {
    progress,
    isComplete,
    hasError,
    preload,
  };
}

/**
 * Optimize image URL for Next.js Image component
 */
export function optimizeImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = DEFAULT_CONFIG.quality
): string {
  const params = new URLSearchParams();

  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  params.set("q", quality.toString());

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}${params.toString()}`;
}

/**
 * Get optimal image dimensions based on container and device
 */
export function getOptimalImageSize(
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio: number = 1
): { width: number; height: number } {
  return {
    width: Math.ceil(containerWidth * devicePixelRatio),
    height: Math.ceil(containerHeight * devicePixelRatio),
  };
}

/**
 * Image cache for storing loaded images
 */
class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private maxSize = 50;

  set(src: string, img: HTMLImageElement) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(src, img);
  }

  get(src: string): HTMLImageElement | undefined {
    return this.cache.get(src);
  }

  has(src: string): boolean {
    return this.cache.has(src);
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const imageCache = new ImageCache();
