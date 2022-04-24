import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import type { VFile } from 'vfile'
import type { ResolveFunction } from '../types'
import { codeblock, jsx, meta, previewer } from './plugins'
import { generatePage } from './page'

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

export const transformMarkdown = (file: VFile, resolve: ResolveFunction) => {
  const mFile = processor.processSync(file)
  return generatePage(mFile, resolve)
}
