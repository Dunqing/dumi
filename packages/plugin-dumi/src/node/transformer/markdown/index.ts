import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { VFile } from 'vfile'
import type { ResolveFunction } from '../types'
import { codeblock, debug, embed, jsx, link, meta, page, pre, previewer, slug } from './plugins'

const processor = unified()
  .use(remarkFrontmatter)
  .use(meta)
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw, { passThrough: ['element'] })
  .use(pre)
  .use(debug)
  .use(codeblock)
  .use(slug)
  .use(rehypeAutolinkHeadings)
  .use(link)
  .use(embed)
  .use(previewer)
  .use(jsx)
  .use(page)

export const transformMarkdown = async(file: VFile, resolve: ResolveFunction) => {
  file.data.resolve = resolve
  const mFile = await processor.process(file)

  return mFile.value
}
