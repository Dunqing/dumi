import { Loader } from 'esbuild'
import type { VFile } from 'vfile'
import { analyzeDeps, exportDefaultToConst, exportDefaultToReturn } from '../parser'
import type { ResolveFunction } from '../types'
import { getFilenameExt } from '../utils'

const generateSources = async (source: VFile, resolve: ResolveFunction) => {
  const previewers = source.data.previewers as Record<string, any>
  if (!previewers) return ''
  const keys = Object.keys(previewers || {})
  const maps: Record<string, any> = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const deps = await analyzeDeps({
      ...previewers[key],
      lang: getFilenameExt(key),
      importer: source.path,
      resolve,
    })
    maps[key] = deps
  }

  const codes = Object.entries(maps).map(([key, deps]) => {
    return `${JSON.stringify(key)}: ${JSON.stringify(deps)},`
  }).join('\n')

  return `
    const additionalPreviewerProps = {
      ${codes}
    }
  `
}

const generateRuntimeComponent = (previewers?: Record<string, { path?: string, source?: string }>) => {
  const keys = Object.keys(previewers || {})
  const getName = (index: number) => `runtimeComponent${index}`

  return `
    ${keys.map((k, index) => {
    const { path, source } = previewers![k]
    const name = getName(index)
    return source ? exportDefaultToConst(source, getFilenameExt(k) as Loader, name) : `import ${name} from ${JSON.stringify(path)}`
  }).join('\n')}

    function __runtimeComponent__(src) {
      switch (src) {
        ${keys.map((k, index) => {
    return `case ${JSON.stringify(k)}: return ${getName(index)}`
  }).join('\n')
    }
        default:
          return null;
      }
    }
  `
}

export const renderPage = async (source: VFile, resolve: ResolveFunction) => {
  return `
    import React, { lazy, useCallback } from 'react';
    import { AnchorLink } from '@dumi/theme'
    import { Previewer as ThemePreviewer, Layout, SourceCode } from '@dumi/theme-default'

    ${await generateSources(source, resolve)}
    ${generateRuntimeComponent(source.data.previewers as Record<string, any>)}

    const Previewer = (props) => {
      return <ThemePreviewer {...props} {...additionalPreviewerProps[props.src]} />
    }

    const CodeComponent = ({ src }) => {
      const Component = __runtimeComponent__(src)
      if (!Component) {
        return null
      }
      return <Component />
    }

    export default function markdown() {
      return <Layout meta={${JSON.stringify(source.data)}}>
        <div className="markdown">
          ${source}
        </div>
      </Layout>
    }
  `
}

export const generatePage = async (file: VFile, resolve: ResolveFunction) => {
  return await renderPage(file, resolve)
}
