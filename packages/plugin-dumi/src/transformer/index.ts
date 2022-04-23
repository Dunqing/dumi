import { readFileSync } from 'fs'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import type { VFile } from 'vfile'
import esbuild from 'esbuild'
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

const generateRuntimeComponent = (components?: Record<string, string>) => {
  return `
    function __runtimeComponent__(src) {
      switch (src) {
        ${
          Object.keys(components || {}).map((key) => {
            return `case ${JSON.stringify(key)}: return lazy(() => import(${JSON.stringify(components![key])}));`
          }).join('\n')
        }
        default:
          return null;
      }
    }
  `
}

export const wrapperMarkdown = (source: VFile) => {
  return `
    import React, { lazy } from 'react';
    import { Previewer } from '@dumi/theme-default'

    ${generateRuntimeComponent(source.data.components as Record<string, any>)}
    

    const CodeComponent = ({ src }) => {
      const Component = __runtimeComponent__(src)
      if (!Component) {
        return null
      }
      return <Component />
    }

    export default function markdown() {
      return ${source}
    }
  `
}

export const transform = async(id: string) => {
  const md = processor.processSync({
    value: readFileSync(id).toString(),
    path: id,
  })

  const code = wrapperMarkdown(md)

  return esbuild.transformSync(code, {
    loader: 'jsx',
  })
}
