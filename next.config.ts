// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Build sırasında ESLint hatalarını görmezden gel
  },
  typescript: {
    ignoreBuildErrors: true, // Build sırasında TypeScript hatalarını görmezden gel
  },
};

export default nextConfig;