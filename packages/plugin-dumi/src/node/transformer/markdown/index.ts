import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { VFile } from 'vfile'
import type { ResolveFunction } from '../types'
import { codeblock, embed, jsx, link, meta, previewer, slug } from './plugins'
import { generatePage } from './page'

const processor = unified()
  .use(remarkFrontmatter)
  .use(meta)
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(codeblock)
  .use(slug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeRaw, {
    passThrough: ['demo'],
  })
  .use(link)
  .use(embed)
  .use(previewer)
  .use(jsx)

export const transformMarkdown = (file: VFile, resolve: ResolveFunction) => {
  const mFile = processor.processSync(file)
  return generatePage(mFile, resolve)
}
