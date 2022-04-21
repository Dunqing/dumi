import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeParse from 'rehype-parse/lib'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import { visit } from 'unist-util-visit'
import { remarkYamlData } from './plugins'

const processor = unified()
  .use(remarkFrontmatter, { type: 'yaml', marker: '-' })
  .use(remarkYamlData)
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify)

export const transform = async(code: string) => {
  let ast: any = processor.parse(code)
  // TODO: parse code
  ast = processor.runSync(ast)
  visit(ast, {
    type: 'element',
    tagName: 'code',
  }, (node) => {
    console.log('🚀 ~ file: index.ts ~ line 27 ~ transform ~ node', node)
  })
  return ''
}
