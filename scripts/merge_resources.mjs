import { readFileSync, writeFileSync } from 'fs'

const resourcesPath = 'data/resources.json'
const newResourcesPath = 'C:\\Users\\samet\\AppData\\Local\\Temp\\opencode\\new_resources.json'

const resources = JSON.parse(readFileSync(resourcesPath, 'utf8'))
const newData = JSON.parse(readFileSync(newResourcesPath, 'utf8'))

let added = 0
let skipped = 0

for (const category of resources.categories) {
  for (const sub of category.subcategories) {
    const newResources = newData[sub.id]
    if (!newResources || !Array.isArray(newResources)) continue

    const existingUrls = new Set(sub.resources.map((r) => r.url.replace(/\/$/, '')))

    for (const res of newResources) {
      const url = res.url.replace(/\/$/, '')
      if (existingUrls.has(url)) {
        skipped++
        continue
      }
      sub.resources.push(res)
      existingUrls.add(url)
      added++
    }
  }
}

writeFileSync(resourcesPath, JSON.stringify(resources, null, 2) + '\n', 'utf8')
console.log(`Merged ${added} new resources, skipped ${skipped} duplicates.`)
