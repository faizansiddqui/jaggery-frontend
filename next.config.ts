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

/**
 * Server-side proxy target for /api/backend/* (must be THIS app’s Node API, not another project).
 * Prefer BACKEND_PROXY_TARGET; else same origin as NEXT_PUBLIC_BACKEND_URL (your Jaggery deploy URL).
 * Never hardcode a foreign backend — that was causing production to read the ecommerce Mongo catalog.
 */
const resolvedProxy =
  process.env.BACKEND_PROXY_TARGET?.trim() ||
  (process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || ""
    : "") ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:8080" : "");

if (process.env.NODE_ENV === "production" && !resolvedProxy) {
  console.warn(
    "[next.config] Set BACKEND_PROXY_TARGET or NEXT_PUBLIC_BACKEND_URL to your Jaggery backend URL (e.g. Railway). Rewrites may not work until set."
  );
}

const backendProxyTarget = normalizeTarget(resolvedProxy || "http://localhost:8080");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "fonts.gstatic.com" },
    ],
  },
  async rewrites() {
    return [
      // Admin routes: /api/backend/admin/* -> backend/api/backend/admin/*
      {
        source: "/api/backend/admin/:path*",
        destination: `${backendProxyTarget}/api/backend/admin/:path*`,
      },
      // User routes: /api/backend/user/* -> backend/user/*
      {
        source: "/api/backend/user/:path*",
        destination: `${backendProxyTarget}/user/:path*`,
      },
      // Auth routes: /api/backend/api/auth/* -> backend/api/auth/*
      {
        source: "/api/backend/api/auth/:path*",
        destination: `${backendProxyTarget}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
