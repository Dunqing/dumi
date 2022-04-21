import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import { remarkYamlData } from './plugins'

const processor = unified()
  .use(remarkFrontmatter, { type: 'yaml', marker: '-' })
  .use(remarkYamlData)
  .use(remarkParse)
  .use(remarkRehype)
  .use(remarkStringify)

export const transform = async(code: string) => {
  const ast = processor.processSync(code)
  console.log(ast)
  return ''
}
