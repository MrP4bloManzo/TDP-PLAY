import type { NextConfig } from 'next'
// Sitio 100% estático para GitHub Pages. El workflow define NEXT_PUBLIC_BASE_PATH=/<nombre-del-repo>.
const config: NextConfig = { output: 'export', trailingSlash: true, images: { unoptimized: true }, basePath: process.env.NEXT_PUBLIC_BASE_PATH || '' }
export default config
