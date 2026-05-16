import { defineConfig } from 'vitepress'
import resourcesData from '../data/resources.json'

const sidebarItems = [{ text: 'All Resources', link: '/resources' }]

for (const category of resourcesData.categories) {
  sidebarItems.push({
    text: `${category.icon} ${category.name}`,
    collapsed: true,
    items: category.subcategories.map((sub) => ({
      text: sub.name,
      link: `/resources/${category.id}/${sub.id}`
    }))
  })
}

export default defineConfig({
  srcDir: '.',
  ignoreDeadLinks: true,
  title: 'Computer Science Resources',
  description:
    'Curated computer science learning resources, coding exercises, practice platforms, and online courses for developers.',
  head: [
    [
      'meta',
      {
        name: 'keywords',
        content:
          'computer science, programming exercises, coding challenges, online learning, developer resources, programming courses, practice platforms'
      }
    ],
    ['meta', { property: 'og:title', content: 'Computer Science Resources' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Curated computer science learning resources, coding exercises, practice platforms, and online courses for developers.'
      }
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    siteTitle: 'Computer Science<br/>Resources',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Resources', link: '/resources' },
      {
        text: 'Contribute',
        link: 'https://github.com/sametcn99/computer-science-resources/blob/main/CONTRIBUTING.md'
      }
    ],

    sidebar: [
      {
        text: 'Resources',
        items: sidebarItems
      }
    ],

    footer: {
      message: 'Released under the MIT License.'
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/sametcn99/computer-science-resources',
        ariaLabel: 'GitHub Repository'
      }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/sametcn99/computer-science-resources/blob/main/CONTRIBUTING.md',
      text: 'Edit this page on GitHub'
    },

    outline: {
      level: [2, 3]
    },

    lastUpdated: true,

    logo: '/logo.svg'
  },

  markdown: {
    lineNumbers: true
  }
})
