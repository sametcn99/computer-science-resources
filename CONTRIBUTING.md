# Contributing to Computer Science Resources

## ⚠️ Important Notes

### Do Not Edit the `resources/` Folder

The `resources/` folder is **automatically generated** from `data/resources.json`. All files in this directory are overwritten each time you run `bun run generate`.

**Never make manual edits to files in the `resources/` folder.** Your changes will be lost.

### What This Project Is NOT

This project lists **practice platforms, exercise sites, and learning resources** - NOT documentation or reference materials.

**We do NOT accept:**

- Language documentation (MDN, Python Docs, React Docs, etc.)
- Framework documentation (Vue, Angular, Svelte, Next.js, etc.)
- Tool documentation (Docker docs, Kubernetes docs, etc.)
- Reference guides or API documentation
- Youtube channels, podcasts, blogs, newsletters, or other content that is not primarily focused on interactive learning or practice

**We DO accept:**

- Interactive coding platforms with exercises (LeetCode, Exercism, etc.)
- Online courses and learning platforms (Coursera, edX, etc.)
- Interview preparation platforms (Pramp, Interviewing.io, etc.)
- CTF and cybersecurity labs (picoCTF, Hack The Box, etc.)
- Linux/DevOps hands-on labs (OverTheWire, Katacoda, etc.)
- University open courseware (MIT OCW, Harvard CS50, etc.)
- Game-based coding learning platforms (CodinGame, CodeCombat, etc.)
- Networking practice platforms (Subnetting Practice, ProProfs Cisco Quiz, etc.)
- Related new categories of learning platforms that fit the above criteria

### Language Requirement

All resources must be accessible in English. Resources that are only available in other languages without English translation are not accepted.

### Reporting Invalid Resources

If you find a resource that violates the above rules (e.g., documentation, reference materials, or content that is not primarily focused on interactive learning or practice), you can:

- Open an issue to report it
- Submit a pull request to remove it from `data/resources.json`

---

## How to Add or Update Resources

The `resources/` folder is **automatically generated** from `data/resources.json`. All files in this directory are overwritten each time you run `bun run generate`.

**Never make manual edits to files in the `resources/` folder.** Your changes will be lost.

---

## How to Add or Update Resources

### Step 1: Edit the Data Source

All resources are stored in a single source of truth:

```text
data/resources.json
```

### Step 2: Validate Your Changes

Run the validation script to ensure your JSON follows the schema:

```bash
bun run validate
```

### Step 3: Generate Pages

After editing `resources.json`, regenerate all pages:

```bash
bun run generate
```

### Step 4: Submit Your Changes

Commit the following files:

- `data/resources.json` (your changes)
- `data/resources.json.bak` (if created by validation)

Do **not** commit the `resources/` folder - it is generated automatically.

---

## JSON Schema

The `resources.json` file must follow this structure:

```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "Category Name",
      "description": "Category description",
      "icon": "📚",
      "subcategories": [
        {
          "id": "subcategory-id",
          "name": "Subcategory Name",
          "resources": [
            {
              "name": "Resource Name",
              "url": "https://example.com",
              "description": "Resource description (10-200 chars)",
              "price": "free" // or "freemium" or "paid"
            }
          ]
        }
      ]
    }
  ],
  "priceLabels": {
    "free": "Free",
    "freemium": "Freemium",
    "paid": "Paid"
  },
  "priceBadge": {
    "free": "tip",
    "freemium": "warning",
    "paid": "danger"
  }
}
```

### Field Rules

| Field                  | Rules                                         |
| ---------------------- | --------------------------------------------- |
| `category.id`          | kebab-case, lowercase, alphanumeric + hyphens |
| `subcategory.id`       | kebab-case, lowercase, alphanumeric + hyphens |
| `resource.price`       | Must be one of: `free`, `freemium`, `paid`    |
| `resource.url`         | Must be a valid URL (https required)          |
| `resource.description` | 10-200 characters                             |

---

## Available Scripts

```bash
bun run validate    # Validate resources.json against schema
bun run generate    # Generate all pages from JSON
bun run build       # Build the VitePress site
bun run dev         # Start development server
```

---

## Need Help?

If you have questions about contributing, please open an issue on GitHub.
