import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(rootDir, 'data')
const resourcesDir = path.join(rootDir, 'resources')

const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'resources.json'), 'utf-8'))

function getBadgeType(price) {
  const badgeMap = { free: 'tip', freemium: 'warning', paid: 'danger' }
  return badgeMap[price] || 'warning'
}

function getBadgeText(price) {
  return data.priceLabels[price] || price
}

function generateCategoryPage(category) {
  const resourcesCount = category.subcategories.reduce((sum, sub) => sum + sub.resources.length, 0)

  return `---
title: "${category.icon} ${category.name}"
description: "${category.description}"
---

${category.description}

## Subcategories

${category.subcategories
  .map((sub) => {
    const count = sub.resources.length
    const freeCount = sub.resources.filter((r) => r.price === 'free').length
    const freemiumCount = sub.resources.filter((r) => r.price === 'freemium').length
    const paidCount = sub.resources.filter((r) => r.price === 'paid').length

    return `- **[${sub.name}](/resources/${category.id}/${sub.id})** - ${count} resources (${freeCount} free, ${freemiumCount} freemium, ${paidCount} paid)`
  })
  .join('\n')}

## All Resources (${resourcesCount})

${category.subcategories
  .map((sub) => {
    return `### ${sub.name}

${sub.resources
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
  return `---
title: "${category.icon} ${subcategory.name}"
description: "${category.description}"
---

${category.description}

## Filter by Price

- [All](/resources/${category.id}/${subcategory.id}) - ${subcategory.resources.length} resources
- [Free](/resources/${category.id}/${subcategory.id}/free) - ${subcategory.resources.filter((r) => r.price === 'free').length} resources
- [Freemium](/resources/${category.id}/${subcategory.id}/freemium) - ${subcategory.resources.filter((r) => r.price === 'freemium').length} resources
- [Paid](/resources/${category.id}/${subcategory.id}/paid) - ${subcategory.resources.filter((r) => r.price === 'paid').length} resources

## All Resources

${subcategory.resources
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

- [All](/resources/${category.id}/${subcategory.id}) - ${subcategory.resources.length} resources
- [Free](/resources/${category.id}/${subcategory.id}/free) - ${subcategory.resources.filter((r) => r.price === 'free').length} resources
- [Freemium](/resources/${category.id}/${subcategory.id}/freemium) - ${subcategory.resources.filter((r) => r.price === 'freemium').length} resources
- [Paid](/resources/${category.id}/${subcategory.id}/paid) - ${subcategory.resources.filter((r) => r.price === 'paid').length} resources

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

| Total | Free | Freemium | Paid |
|-------|------|----------|------|
| ${totalResources} | ${freeCount} | ${freemiumCount} | ${paidCount} |

## Categories

${data.categories
  .map((cat) => {
    const count = cat.subcategories.reduce((sum, sub) => sum + sub.resources.length, 0)
    return `- **[${cat.icon} ${cat.name}](/resources/${cat.id})** - ${count} resources`
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

## 🔮 Future Expansions

Consider adding these categories in the future:

- Frontend Practice - React, Vue, Angular, CSS, UI/UX
- Backend Practice - Node.js, Python, Go, databases
- Mobile Development - React Native, Flutter, Swift, Kotlin
- Data Science & ML - Python, TensorFlow, PyTorch, Kaggle
- Database Practice - SQL, NoSQL, PostgreSQL, MongoDB
- API Development - REST, GraphQL, gRPC
- Testing & QA - Unit testing, integration testing, automation
- Version Control - Git, GitHub, GitLab workflows

---

## 🤝 Contributing

Found a great resource? Contributions are welcome!

1. Fork the repository
2. Add your resource to \`data/resources.json\`
3. Run \`bun run generate\` to regenerate pages
4. Submit a pull request
`
}

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true })
}

fs.writeFileSync(path.join(resourcesDir, 'index.md'), generateIndexPage())

for (const category of data.categories) {
  const categoryDir = path.join(resourcesDir, category.id)
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
  }

  fs.writeFileSync(path.join(categoryDir, 'index.md'), generateCategoryPage(category))

  for (const subcategory of category.subcategories) {
    const subcategoryDir = path.join(categoryDir, subcategory.id)
    if (!fs.existsSync(subcategoryDir)) {
      fs.mkdirSync(subcategoryDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(subcategoryDir, 'index.md'),
      generateSubcategoryPage(category, subcategory)
    )

    for (const price of ['free', 'freemium', 'paid']) {
      const priceDir = path.join(subcategoryDir, price)
      if (!fs.existsSync(priceDir)) {
        fs.mkdirSync(priceDir, { recursive: true })
      }

      fs.writeFileSync(
        path.join(priceDir, 'index.md'),
        generatePricePage(category, subcategory, price)
      )
    }
  }
}

console.log('✅ Pages generated successfully!')
