import type { ResolvedConfig } from 'vite'

import type { RouteObject } from 'react-router-dom'
import type { ResolveFunction } from '../transformer'
import { transform } from '../transformer'
import { detectMarkdowns } from './markdown'

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
      source: file.value,
      meta: file.data as unknown as MetaData,
    })
  }

  return transformResults
}

const indexRE = /index$/

export const buildingRoutes = async(config: ResolvedConfig, resolve: ResolveFunction) => {
  const sources = await loadMarkdowns(config.root, resolve)
  const routePathRE = /(docs|src)([\/\w\d\-_\.]+)?\.md/
  const routes: RouteObject[] = []

  sources.forEach((item) => {
    const routePath = routePathRE.exec(item.id)![2]
    let paths = routePath.split('/')
    const metaPath = (item.meta.nav?.path || '') + (item.meta.group?.path || '')
    paths = metaPath ? paths.splice(0, paths.length - 2, ...metaPath.split('/')) : paths

    let curRoutes = routes
    paths.forEach((p) => {
      const cr = curRoutes.find(r => r.path === (p || '/'))
      const children: RouteObject[] = cr?.children || []
      if (!cr) {
        const index = indexRE.test(p)
        curRoutes.push({
          path: index ? undefined : p || '/',
          element: '',
          children,
          index,
        })
      }
      curRoutes = children
    })
  })

  return routes
}

export const generateRoutes = async(config: ResolvedConfig, resolve: ResolveFunction) => {
  const routes = await buildingRoutes(config, resolve)
  console.log(JSON.stringify(routes))
  return routes
  // const tries = buildingPathTrie()
}
