import { readFileSync } from 'fs'
import path from 'path'
import { describe, it } from 'vitest'
import { transform } from '../node'

const readFile = (file: string) => {
  return readFileSync(path.resolve(__dirname, file)).toString()
}

describe('transformer', () => {
  it('frontmatter work', async() => {
    const id = path.resolve(__dirname, './md/code.md')
    await transform(id, () => null)
  })
})
