import type { NextConfig } from "next";

const normalizeTarget = (value: string) => {
  let output = String(value || "").trim();
  if (!output) return "";
  output = output.replace(/\.railiway\.app/gi, ".railway.app");
  if (!/^https?:\/\//i.test(output)) {
    output = `https://${output}`;
  }
  return output.replace(/\/$/, "");
};

const defaultProxyTarget = process.env.NODE_ENV === "production"
  ? "https://street-riot-backend-production.up.railway.app"
  : "http://localhost:8080";

const backendProxyTarget = normalizeTarget(process.env.BACKEND_PROXY_TARGET || defaultProxyTarget);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "fonts.gstatic.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
