import type { VFile } from 'vfile'
import { analyzeDeps } from '../parser'
import type { ResolveFunction } from '../types'

const generateSources = async(components: Record<string, string> | undefined, resolve: ResolveFunction) => {
  const keys = Object.keys(components || {})
  const maps: Record<string, any> = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const deps = await analyzeDeps(components![key], resolve)
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

export const renderPage = async(source: VFile, resolve: ResolveFunction) => {
  return `
    import React, { lazy, useCallback } from 'react';
    import { AnchorLink } from '@dumi/theme'
    import { Previewer as ThemePreviewer, Layout } from '@dumi/theme-default'

    const meta = ${JSON.stringify(source.data)}

    ${await generateSources(source.data.components as Record<string, any>, resolve)}
    ${generateRuntimeComponent(source.data.components as Record<string, any>)}

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
      return <Layout meta={meta}>
        <div className="markdown">
          ${source}
        </div>
      </Layout>
    }
  `
}

export const generatePage = async(file: VFile, resolve: ResolveFunction) => {
  return await renderPage(file, resolve)
}
