import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { format } from 'prettier'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(rootDir, 'data')
const resourcesDir = path.join(rootDir, 'resources')

const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'resources.json'), 'utf-8'))

const SITE_URL = 'https://computer-science-resources.vercel.app'

function getBadgeType(price) {
  const badgeMap = { free: 'tip', freemium: 'warning', paid: 'danger' }
  return badgeMap[price] || 'warning'
}

function getBadgeText(price) {
  return data.priceLabels[price] || price
}

function generateCategoryPage(category) {
  const resourcesCount = category.subcategories.reduce((sum, sub) => sum + sub.resources.length, 0)
  const freeCount = category.subcategories.reduce(
    (s, sub) => s + sub.resources.filter((r) => r.price === 'free').length,
    0
  )
  const desc = `${resourcesCount} curated ${category.name.toLowerCase()} resources for developers. ${freeCount} free resources available across ${category.subcategories.length} subcategories.`

  return `---
title: "${category.icon} ${category.name}"
description: "${desc}"
head:
  - - meta
    - property: og:description
      content: "${desc}"
  - - meta
    - property: og:title
      content: "${category.name} - CS Resources"
  - - script
    - type: application/ld+json
      content: '${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category.name}`,
        description: desc,
        url: `${SITE_URL}/resources/${category.id}`,
        numberOfItems: resourcesCount
      })}'
---

${category.description}

## Subcategories

${category.subcategories
  .map((sub) => {
    const count = sub.resources.length
    const freeCount = sub.resources.filter((r) => r.price === 'free').length
    const freemiumCount = sub.resources.filter((r) => r.price === 'freemium').length
    const paidCount = sub.resources.filter((r) => r.price === 'paid').length

    return `- **[${sub.name}](/resources/${category.id}/${sub.id}/)** - ${count} resources (${freeCount} free, ${freemiumCount} freemium, ${paidCount} paid)`
  })
  .join('\n')}

## All Resources (${resourcesCount})

${category.subcategories
  .map((sub) => {
    return `### ${sub.name}

${sub.resources
  .sort((a, b) => {
    const priceOrder = { free: 0, freemium: 1, paid: 2 }
    if (priceOrder[a.price] !== priceOrder[b.price]) {
      return priceOrder[a.price] - priceOrder[b.price]
    }
    return a.name.localeCompare(b.name)
  })
  .map(
    (
      r
    ) => `- **[${r.name}](${r.url})** <Badge type="${getBadgeType(r.price)}" text="${getBadgeText(r.price)}" />
  - ${r.description}`
  )
  .join('\n')}
`
  })
  .join('\n')}
`
}

function generateSubcategoryPage(category, subcategory) {
  const count = subcategory.resources.length
  const freeCount = subcategory.resources.filter((r) => r.price === 'free').length
  const desc = `${count} ${subcategory.name.toLowerCase()} resources for developers. ${freeCount} free ${subcategory.name.toLowerCase()} platforms and tools to practice and learn.`

  return `---
title: "${category.icon} ${subcategory.name}"
description: "${desc}"
head:
  - - meta
    - property: og:description
      content: "${desc}"
  - - meta
    - property: og:title
      content: "${subcategory.name} - CS Resources"
  - - script
    - type: application/ld+json
      content: '${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${subcategory.name}`,
        description: desc,
        url: `${SITE_URL}/resources/${category.id}/${subcategory.id}`,
        numberOfItems: count
      })}'
---

${category.description}

## Filter by Price

- [All](/resources/${category.id}/${subcategory.id}/) - ${subcategory.resources.length} resources
- [Free](/resources/${category.id}/${subcategory.id}/free/) - ${subcategory.resources.filter((r) => r.price === 'free').length} resources
- [Freemium](/resources/${category.id}/${subcategory.id}/freemium/) - ${subcategory.resources.filter((r) => r.price === 'freemium').length} resources
- [Paid](/resources/${category.id}/${subcategory.id}/paid/) - ${subcategory.resources.filter((r) => r.price === 'paid').length} resources

## All Resources

${subcategory.resources
  .sort((a, b) => {
    const priceOrder = { free: 0, freemium: 1, paid: 2 }
    if (priceOrder[a.price] !== priceOrder[b.price]) {
      return priceOrder[a.price] - priceOrder[b.price]
    }
    return a.name.localeCompare(b.name)
  })
  .map(
    (
      r
    ) => `- **[${r.name}](${r.url})** <Badge type="${getBadgeType(r.price)}" text="${getBadgeText(r.price)}" />
  - ${r.description}`
  )
  .join('\n')}
`
}

function generatePricePage(category, subcategory, price) {
  const filteredResources = subcategory.resources.filter((r) => r.price === price)
  const priceLabel = data.priceLabels[price]

  return `---
title: "${category.icon} ${subcategory.name} - ${priceLabel}"
description: "${category.description}"
---

${category.description}

## Filter by Price

- [All](/resources/${category.id}/${subcategory.id}/) - ${subcategory.resources.length} resources
- [Free](/resources/${category.id}/${subcategory.id}/free/) - ${subcategory.resources.filter((r) => r.price === 'free').length} resources
- [Freemium](/resources/${category.id}/${subcategory.id}/freemium/) - ${subcategory.resources.filter((r) => r.price === 'freemium').length} resources
- [Paid](/resources/${category.id}/${subcategory.id}/paid/) - ${subcategory.resources.filter((r) => r.price === 'paid').length} resources

## ${priceLabel} Resources (${filteredResources.length})

${filteredResources
  .map(
    (
      r
    ) => `- **[${r.name}](${r.url})** <Badge type="${getBadgeType(r.price)}" text="${getBadgeText(r.price)}" />
  - ${r.description}`
  )
  .join('\n')}
`
}

function generateIndexPage() {
  const totalResources = data.categories.reduce(
    (sum, cat) => sum + cat.subcategories.reduce((s, sub) => s + sub.resources.length, 0),
    0
  )

  const freeCount = data.categories.reduce(
    (sum, cat) =>
      sum +
      cat.subcategories.reduce(
        (s, sub) => s + sub.resources.filter((r) => r.price === 'free').length,
        0
      ),
    0
  )

  const freemiumCount = data.categories.reduce(
    (sum, cat) =>
      sum +
      cat.subcategories.reduce(
        (s, sub) => s + sub.resources.filter((r) => r.price === 'freemium').length,
        0
      ),
    0
  )

  const paidCount = data.categories.reduce(
    (sum, cat) =>
      sum +
      cat.subcategories.reduce(
        (s, sub) => s + sub.resources.filter((r) => r.price === 'paid').length,
        0
      ),
    0
  )

  return `---
title: "Resources"
description: "Curated computer science resources, coding challenge, and online learning platforms for software developers."
---

> Curated computer science resources, coding challenge, and online learning platforms for software developers.

## Statistics

\`\`\`mermaid
pie
    title Resource Distribution
    "Free" : ${freeCount}
    "Freemium" : ${freemiumCount}
    "Paid" : ${paidCount}
\`\`\`

## Categories

${data.categories
  .map((cat) => {
    const count = cat.subcategories.reduce((sum, sub) => sum + sub.resources.length, 0)
    return `- **[${cat.icon} ${cat.name}](/resources/${cat.id}/)** - ${count} resources`
  })
  .join('\n')}

---

## 🏷️ Categories Legend

| Badge | Meaning |
|-------|---------|
| <Badge type="tip" text="Free" /> | Fully accessible without payment |
| <Badge type="warning" text="Freemium" /> | Limited free content with paid upgrades |
| <Badge type="danger" text="Paid" /> | Requires subscription or purchase |

---

## 🤝 Contributing

Found a great resource? Contributions are welcome!

1. Fork the repository
2. Add your resource to \`data/resources.json\`
3. Run \`bun run generate\` to regenerate pages
4. Submit a pull request
`
}

async function writeFormatted(filePath, content) {
  const formatted = await format(content, {
    filepath: filePath,
    singleQuote: true,
    semi: false,
    trailingComma: 'none',
    printWidth: 100,
    proseWrap: 'never'
  })
  fs.writeFileSync(filePath, formatted)
}

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true })
}

await writeFormatted(path.join(resourcesDir, 'index.md'), generateIndexPage())

for (const category of data.categories) {
  const categoryDir = path.join(resourcesDir, category.id)
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
  }

  await writeFormatted(path.join(categoryDir, 'index.md'), generateCategoryPage(category))

  for (const subcategory of category.subcategories) {
    const subcategoryDir = path.join(categoryDir, subcategory.id)
    if (!fs.existsSync(subcategoryDir)) {
      fs.mkdirSync(subcategoryDir, { recursive: true })
    }

    await writeFormatted(
      path.join(subcategoryDir, 'index.md'),
      generateSubcategoryPage(category, subcategory)
    )

    for (const price of ['free', 'freemium', 'paid']) {
      const priceDir = path.join(subcategoryDir, price)
      if (!fs.existsSync(priceDir)) {
        fs.mkdirSync(priceDir, { recursive: true })
      }

      await writeFormatted(
        path.join(priceDir, 'index.md'),
        generatePricePage(category, subcategory, price)
      )
    }
  }
}

// Cleanup: Remove orphaned directories/files that no longer exist in resources.json
function getExpectedPaths() {
  const expected = new Set()

  // Root index
  expected.add('index.md')

  for (const category of data.categories) {
    // Category index
    expected.add(`${category.id}/index.md`)

    for (const subcategory of category.subcategories) {
      // Subcategory index
      expected.add(`${category.id}/${subcategory.id}/index.md`)

      // Price pages
      for (const price of ['free', 'freemium', 'paid']) {
        expected.add(`${category.id}/${subcategory.id}/${price}/index.md`)
      }
    }
  }

  return expected
}

function cleanupOrphanedFiles() {
  const expected = getExpectedPaths()

  function walk(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        // Check if directory has index.md - if not, it's empty and should be removed
        const indexPath = path.join(fullPath, 'index.md')

        if (!expected.has(relPath + '/index.md') && !expected.has(relPath + '/')) {
          // This directory shouldn't exist - delete it
          fs.rmSync(fullPath, { recursive: true, force: true })
          console.log(`🗑️  Removed orphaned directory: ${relPath}`)
          continue
        }

        // Recurse into expected directories
        walk(fullPath, relPath)
      } else if (entry.isFile()) {
        // Check if file is expected
        const expectedPath = relPath.endsWith('.md') ? relPath : null

        // The only expected file is index.md
        if (!expected.has(relPath)) {
          fs.unlinkSync(fullPath)
          console.log(`🗑️  Removed orphaned file: ${relPath}`)
        }
      }
    }
  }

  // Clean up empty directories that might remain
  function cleanEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })
    let hasFiles = false

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        cleanEmptyDirs(fullPath)
        // Check if directory is now empty
        const remaining = fs.readdirSync(fullPath)
        if (remaining.length === 0) {
          fs.rmdirSync(fullPath)
          console.log(`🗑️  Removed empty directory: ${path.relative(resourcesDir, fullPath)}`)
        } else {
          hasFiles = true
        }
      } else {
        hasFiles = true
      }
    }
  }

  console.log('\n🧹 Running cleanup...')
  walk(resourcesDir)
  cleanEmptyDirs(resourcesDir)
}

cleanupOrphanedFiles()

console.log('✅ Pages generated successfully!')
