import { transformSync } from 'esbuild'
import type { ResolvedConfig } from 'vite'
import type { ResolveFunction } from '../transformer'
import { loadMarkdowns } from './markdown'
import { generateNav, generateRoutes } from './routes'

export * from './markdown'
export * from './routes'

const generateParsedPath = () => {
  return `
    export const parsedPath = (item: any) => {
      const firstLocale = locales[0]
      const localesRE = new RegExp(\`\\\\.(\$\{locales.join('|')\})\$\`)
      const routePathRE = new RegExp("(docs|src)([\\\\/\\\\w\\\\d\\\\-_\\\\.]+)?.md");

      const routePath = routePathRE.exec(item.id)![2]
      let paths = routePath.split('/')
      const namePath = paths[paths.length - 1]
      paths = paths.slice(0, -1)
      const metaPath = (item.meta.nav?.path || '') + (item.meta.group?.path || '')
      paths = metaPath ? paths.splice(0, paths.length - 2, ...metaPath.split('/')) : paths

      const locale = localesRE.exec(namePath)?.[1]
      if (locale && locale !== firstLocale) {
        paths.splice(0, 1, '/' + locale)
      }
      paths.push(namePath.replace(localesRE, ''))

      return { paths, locale: locale || firstLocale }
    }
  `
}

export const dumiProvider = async (
  config: ResolvedConfig,
  resolve: ResolveFunction
) => {
  const Sources = await loadMarkdowns(config.root, resolve)
  const locales = [
    ['en-US', 'English'],
    ['zh-CN', '中文'],
  ].map((i) => i[0])

  const code = `
    import React, { lazy } from 'react'

    const Sources = ${JSON.stringify(Sources)}
    const locales = ${JSON.stringify(locales)}

    ${await generateParsedPath()}
    ${await generateRoutes(Sources)}
    ${await generateNav()}
  `

  return transformSync(code, {
    loader: 'tsx',
  })
}
