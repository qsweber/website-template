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
};

module.exports = nextConfig;
