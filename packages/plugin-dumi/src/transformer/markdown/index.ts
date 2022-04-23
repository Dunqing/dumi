import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import type { VFile } from 'vfile'
import { codeblock, jsx, jsxStringify, meta, previewer } from './plugins'

const processor = unified()
  .use(remarkFrontmatter)
  .use(meta)
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(codeblock)
  .use(rehypeRaw, {
    passThrough: ['demo'],
  })
  .use(previewer)
  .use(jsx)
  .use(jsxStringify)

export const transformMarkdown = (file: VFile) => {
  return processor.processSync(file)
}
