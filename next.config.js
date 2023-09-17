/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: ['assets.stickpng.com'],
    },
}

module.exports = nextConfig
