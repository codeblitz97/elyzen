// import withPWAInit from '@ducanh2912/next-pwa';

// const withPWA = withPWAInit({
//   dest: 'public',
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   swcMinify: true,
//   disable: process.env.NODE_ENV === 'development',
//   fallbacks: {
//     //image: "/static/images/fallback.png",
//     document: '/offline', // if you want to fallback to a custom page rather than /_offline
//     // font: '/static/font/fallback.woff2',
//     // audio: ...,
//     // video: ...,
//   },
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// });

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 's4.anilist.co',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'artworks.thetvdb.com',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'media.kitsu.io',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'img1.ak.crunchyroll.com',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
    ],
  },
};

const combinedConfig = nextConfig;

export default combinedConfig;
