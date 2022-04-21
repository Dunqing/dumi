import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import { remarkYamlParse } from './plugins'

const processor = unified()
  .use(remarkFrontmatter, { type: 'yaml', marker: '-' })
  .use(remarkYamlParse)
  .use(remarkParse)
  .use(remarkStringify)

export const transform = async(code: string) => {
  const ast = processor.processSync(code)
  return ''
}
