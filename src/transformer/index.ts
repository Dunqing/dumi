import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeParse from 'rehype-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, { type: 'yaml', marker: '-' })
  .use(remarkRehype)

export const transform = async(code: string) => {
  const ast = processor.parse(code)
  console.log(ast)
  return ''
}
