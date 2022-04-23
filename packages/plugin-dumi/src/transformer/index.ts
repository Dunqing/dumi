import { readFileSync } from 'fs'
import { transformSync } from 'esbuild'
import { VFile } from 'vfile'
import { transformMarkdown } from './markdown'

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

export const transform = (id: string) => {
  const file = new VFile({
    path: id,
    value: readFileSync(id).toString(),
  })
  const mFile = transformMarkdown(file)

  const source = wrapperMarkdown(mFile)
  return transformSync(source, {
    loader: 'jsx',
  })
}
