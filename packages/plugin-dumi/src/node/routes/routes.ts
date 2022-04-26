import type { ResolvedConfig } from 'vite'

import type { RouteObject } from 'react-router-dom'
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




export const generateRoutes = async(config: ResolvedConfig, resolve: ResolveFunction) => {
  const Sources = await loadMarkdowns(config.root, resolve)

  const code = `
    import React, { lazy } from 'react'

    const __runtimeComponent__ = (src) => {
      switch (src) {
        ${
          Sources.map((s) => {
            return `case ${JSON.stringify(s.id)}: return lazy(() => import(${JSON.stringify(s.path)}));`
          }).join('\n')
        }
      }
    }

    const Sources = ${JSON.stringify(Sources)}

    const indexRE = /index$/

    const buildingRoutes = () => {
      const routePathRE = new RegExp("(docs|src)([\\\\/\\\\w\\\\d\\\\-_\\\\.]+)?.md");
      const routes: RouteObject[] = [];

      Sources.forEach((item) => {
        const routePath = routePathRE.exec(item.id)![2]
        let paths = routePath.split('/')
        const metaPath = (item.meta.nav?.path || '') + (item.meta.group?.path || '')
        paths = metaPath ? paths.splice(0, paths.length - 2, ...metaPath.split('/')) : paths

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

  export default buildingRoutes()
  `

  console.log("🚀 ~ file: routes.ts ~ line 106 ~ generateRoutes ~ code", code)
  return transformSync(code, {
    loader: 'tsx'
  })
}
