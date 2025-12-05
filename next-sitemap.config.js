/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://parthg.tech',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: './public',
  // Explicitly define all paths since we use a catch-all route
  additionalPaths: async (config) => {
    const paths = [
      // Root
      '/',
      // Main sections
      '/me',
      '/experience',
      '/projects',
      '/stack',
      '/thoughts',
      '/wins',
      // Experience children
      '/experience/cred',
      '/experience/hpe',
      '/experience/ecom',
      '/experience/conscent',
      '/experience/persona',
      // Project children
      '/projects/stockpiece',
      '/projects/moderation',
      '/projects/persona',
      '/projects/skilljourney',
      // Thoughts/blogs
      '/thoughts/blog-blinkit-interview',
      '/thoughts/blog-sprinklr-interview',
      '/thoughts/blog-cred-interview',
      '/thoughts/thought-1',
    ];

    return paths.map((path) => ({
      loc: path,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : path.split('/').length === 2 ? 0.8 : 0.6,
      lastmod: new Date().toISOString(),
    }));
  },
}
