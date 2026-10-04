// NOTE: `npm run build` runs `next build --webpack`, not Turbopack (the
// Next.js 16 default). Turbopack resolves @emotion/react to both a CJS and
// ESM build in the same graph, causing intermittent hydration errors (React
// error #418) in this static export. See TODO: https://github.com/qsweber/website-template/issues/25

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // @qsweber/auth-kit ships raw TS/TSX source rather than a prebuilt dist,
  // so Next's own compiler is the only thing that ever compiles its
  // Emotion styled-components (consistent with this app's own).
  transpilePackages: ["@qsweber/auth-kit"],
  // Gives every styled() call a stable, source-location-based class label
  // instead of relying on Emotion's default anonymous-component behavior.
  compiler: {
    emotion: true,
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
