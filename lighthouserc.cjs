module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:4175/#/welcome',
        'http://127.0.0.1:4175/#/',
        'http://127.0.0.1:4175/#/workout',
        'http://127.0.0.1:4175/#/nutrition',
        'http://127.0.0.1:4175/#/program',
      ],
      startServerCommand: 'node scripts/performance-server.mjs',
      startServerReadyPattern: 'Local',
      numberOfRuns: 1,
      puppeteerScript: 'lighthouse-browser.cjs',
      puppeteerLaunchOptions: { args: ['--no-sandbox'] },
      settings: {
        disableStorageReset: true,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'artifacts/lighthouse' },
  },
};
