import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations for route prefetching and code splitting
  experimental: {
    // Enable optimized package imports for better tree shaking
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Configure webpack for better code splitting
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Create separate chunks for vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          // Create separate chunks for common components
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
          },
          // Create separate chunks for icons
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|@radix-ui)[\\/]/,
            name: "icons",
            chunks: "all",
            priority: 15,
          },
        },
      };
    }

    return config;
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
