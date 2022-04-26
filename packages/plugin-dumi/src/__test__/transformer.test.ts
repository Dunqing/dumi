import { readFileSync } from 'fs'
import path from 'path'
import { describe, it } from 'vitest'
import { transform } from '../transformer'

const readFile = (file: string) => {
  return readFileSync(path.resolve(__dirname, file)).toString()
}

describe('transformer', () => {
  it('frontmatter work', () => {
    const id = path.resolve(__dirname, './md/code.md')
    transform(id)
  })
})