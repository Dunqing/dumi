import { readFileSync } from 'fs'
import path from 'path'
import { describe, it } from 'vitest'
import { transform } from '../transformer'

describe('transformer', () => {
  it('work', () => {
    const markdown = readFileSync(path.resolve(__dirname, './md/yaml.md')).toString()
    transform(markdown)
  })
})
