import Ajv from 'ajv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const schemaPath = path.join(rootDir, 'data', 'schema.json')
const dataPath = path.join(rootDir, 'data', 'resources.json')

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

const ajv = new Ajv({ allErrors: true, strict: true, formats: { uri: true } })
const validate = ajv.compile(schema)

const valid = validate(data)

if (valid) {
  console.log('✅ resources.json is valid!')
  process.exit(0)
} else {
  console.error('❌ Validation failed:\n')
  for (const error of validate.errors) {
    console.error(`  - ${error.instancePath}: ${error.message}`)
  }
  process.exit(1)
}
