import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      // Exclude problematic modules on server-side
      config.externals = config.externals || [];
      config.externals.push({
        canvas: "canvas",
        jsdom: "jsdom",
      });
    }

    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist/build/pdf.worker.min.js": require.resolve(
        "pdfjs-dist/build/pdf.worker.min.js",
      ),
    };

    return config;
  },
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;
