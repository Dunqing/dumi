import { readFileSync } from 'fs'
import path from 'path'
import { describe, it } from 'vitest'
import { transform } from '../transformer'

const readFile = (file: string) => {
  return readFileSync(path.resolve(__dirname, file)).toString()
}

describe('transformer', () => {
  it('frontmatter work', () => {
    const markdown = readFile('./md/code.md')
    transform(markdown)
  })
})
