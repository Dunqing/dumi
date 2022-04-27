import type { ResolvedConfig } from 'vite'
import type { ResolveFunction } from '../transformer'
import { transform } from '../transformer'
import { detectMarkdowns } from './markdown'
import { transformSync } from 'esbuild'

interface MetaData {
  group?: {
    path?: string
    title?: string
    order?: number
  }
  nav?: {
    path?: string
    title?: string
    order?: number
  }
  slugs: any[]
}


export const loadMarkdowns = async(root: string, resolve: ResolveFunction) => {
  const paths = detectMarkdowns(root)

  const transformResults = []

  for (let i = 0; i < paths.length; i++) {
    const markdown = paths[i]
    const file = await transform(markdown.id, resolve)
    transformResults.push({
      ...markdown,
      meta: file.data as unknown as MetaData,
    })
  }

  return transformResults
}

type PickPromiseType<T> = T extends Promise<infer U> ? U : T
type SourcesType = PickPromiseType<ReturnType<typeof loadMarkdowns>>


export const generateRoutes = (Sources: SourcesType) => {

  return `
      const buildingRoutes = () => {
        const __runtimeComponent__ = (src) => {
          switch (src) {
            ${
              Sources.map((s) => {
                return `case ${JSON.stringify(s.id)}: return lazy(() => import(${JSON.stringify(s.path)}));`
              }).join('\n')
            }
          }
        }

      const indexRE = /index$/
      const routes: RouteObject[] = [];

        Sources.forEach((item) => {
          const { paths } = parsedPath(item)
          let curRoutes = routes
          paths.forEach((p, index) => {
            let cr = curRoutes.find(r => r.path === (p || '/'))
            const children: RouteObject[] = cr?.children || []
            const isIndex = indexRE.test(p)

            if (!cr) {
              cr = {
                path: isIndex ? undefined : p || '/',
                children,
                index: isIndex,
              }
              curRoutes.push(cr)
            }
            if (index === paths.length - 1) {
              let Component = __runtimeComponent__(item.id)
              Object.assign(cr, {
                path: isIndex ? paths.slice(0, -1).join('/') || '/' : paths.join('/'),
                element: <Component />,
                index: isIndex,
                title: item.meta?.title,
                meta: item.meta
              })
            }
            curRoutes = children
          })
        })

      return routes
    }

    export const routes = buildingRoutes()
  `
}

export const generateNav = () => {

  return `
    function generateNav() {
      const localesNav = {}
      Sources.filter(s => s.meta.nav).forEach((source) => {
        const { paths, locale } = parsedPath(source)
        const navList = (localesNav[locale] || ( localesNav[locale] = []));
        const nav = {
          ...source.meta?.nav,
          path: paths.slice(0, -1).join('/'),
        }
        navList.push(nav)
      })
      Object.keys(localesNav).forEach((locale) => {
        localesNav[locale] = localesNav[locale].sort((prev, next) => {
          const prevOrder = typeof prev.order === 'number' ? prev.order : Infinity;
          const nextOrder = typeof next.order === 'number' ? next.order : Infinity;
          // compare order meta config first
          const metaOrder = prevOrder === nextOrder ? 0 : prevOrder - nextOrder;
          // last compare path length
          const pathOrder = prev.path.length - next.path.length;
          // then compare title ASCII
          const ascOrder = prev.title > next.title ? 1 : prev.title < next.title ? -1 : 0;
          return metaOrder || pathOrder || ascOrder;
        })
      })
      return localesNav
    }

    export const nav = generateNav()
  `  
}


export const dumiProvider = async(config: ResolvedConfig, resolve: ResolveFunction) => {
  const Sources = await loadMarkdowns(config.root, resolve)
  const locales = [['en-US', 'English'], ['zh-CN', '中文']].map(i => i[0])
  
  const code = `
    import React, { lazy } from 'react'

    const Sources = ${JSON.stringify(Sources)}
    const locales = ${JSON.stringify(locales)}

    export const parsedPath = (item: any) => {
    const firstLocale = locales[0]
    const localesRE = new RegExp('\\\\.(${locales.join('|')})$')
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
    ${await generateRoutes(Sources)}
    ${await generateNav()}
  `

  return transformSync(code, {
    loader: 'tsx'
  })
}
