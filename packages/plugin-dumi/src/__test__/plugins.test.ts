import { readFileSync } from 'fs'
import path from 'path'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse/lib'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import { meta } from '../transformer/markdown/plugins'

const readFile = (file: string) => {
  return readFileSync(path.resolve(__dirname, file)).toString()
}

describe('plugins', () => {
  const processor = unified().use(remarkParse).use(remarkStringify)

  it('meta', () => {
    const markdown = readFile('./md/yaml.md')
    const file = processor.use([remarkFrontmatter, meta]).processSync(markdown)
    expect(file.data).toMatchInlineSnapshot(`
      {
        "metadata": {
          "group": {
            "path": "/",
          },
          "legacy": "/table",
          "nav": {
            "path": "/components",
            "title": "组件",
          },
          "order": 0,
          "title": "ProTable - 高级表格",
        },
      }
    `)
  })
})
