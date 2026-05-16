import { defineConfig } from 'vitepress'
import resourcesData from '../data/resources.json'

const SITE_URL = 'https://computer-science-resources.vercel.app'
const SITE_NAME = 'CS Resources'
const DEFAULT_IMAGE = '/og-image.png'

const totalResources = resourcesData.categories.reduce(
  (sum, cat) => sum + cat.subcategories.reduce((s, sub) => s + sub.resources.length, 0),
  0
)

const freeCount = resourcesData.categories.reduce(
  (sum, cat) =>
    sum +
    cat.subcategories.reduce(
      (s, sub) => s + sub.resources.filter((r) => r.price === 'free').length,
      0
    ),
  0
)

function buildHead() {
  const head: any[] = [
    // Favicon
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
    ['link', { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'canonical', href: SITE_URL }],
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['meta', { name: 'author', content: 'CS Resources Contributors' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'computer science resources, programming exercises, coding challenges, learn to code, developer resources, programming courses, practice platforms, free coding resources, CS learning, software engineering resources'
      }
    ],

    // Open Graph - defaults
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:image', content: `${SITE_URL}${DEFAULT_IMAGE}` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    [
      'meta',
      { property: 'og:image:alt', content: 'CS Resources - Curated Developer Learning Resources' }
    ],

    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}${DEFAULT_IMAGE}` }],

    // JSON-LD structured data
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: `Curated collection of ${totalResources}+ computer science learning resources including ${freeCount}+ free resources for developers.`,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/resources?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      })
    ],

    // Sitemap hint for crawlers
    ['link', { rel: 'sitemap', href: '/sitemap.xml', type: 'application/xml' }]
  ]

  return head
}

// Build sidebar from data
const sidebarItems = [{ text: 'All Resources', link: '/resources' }]

for (const category of resourcesData.categories) {
  sidebarItems.push({
    text: `${category.icon} ${category.name}`,
    items: category.subcategories.map((sub) => ({
      text: sub.name,
      link: `/resources/${category.id}/${sub.id}`
    }))
  })
}

// Nav with resource counts
const navItems = [
  { text: 'Home', link: '/' },
  { text: `Resources (${totalResources}+)`, link: '/resources' },
  {
    text: 'Contribute',
    link: 'https://github.com/sametcn99/computer-science-resources/blob/main/CONTRIBUTING.md'
  }
]

export default defineConfig({
  srcDir: '.',
  outDir: '.vitepress/dist',
  ignoreDeadLinks: true,
  title: SITE_NAME,
  description: `Curated collection of ${totalResources}+ computer science learning resources, coding exercises, and online courses for developers. ${freeCount}+ free resources available.`,
  head: buildHead(),

  lastUpdated: true,

  themeConfig: {
    siteTitle: 'CS Resources',

    nav: navItems,

    sidebar: [
      {
        text: 'Resources',
        items: sidebarItems
      }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} CS Resources Contributors`
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/sametcn99/computer-science-resources',
        ariaLabel: 'GitHub Repository'
      }
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            boostDocument: (docId: string) => {
              // Prioritize home and resources pages
              if (docId === 'index.md') return 3
              if (docId.startsWith('resources/index.md')) return 2
              return 1
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/sametcn99/computer-science-resources/blob/main/CONTRIBUTING.md',
      text: 'Edit this page on GitHub'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    darkModeSwitchLabel: 'Appearance',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Return to top',
    langMenuLabel: 'Change language',

    logo: '/logo.svg'
  },

  markdown: {
    lineNumbers: true
  },

  // Sitemap generation
  sitemap: {
    hostname: SITE_URL
  }
})
