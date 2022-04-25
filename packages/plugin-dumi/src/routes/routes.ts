import path, { basename } from "path"
import { ResolvedConfig } from "vite"

import { RouteObject } from 'react-router-dom'
import { buildingPathTrie, detectMarkdowns } from "."
import { ResolveFunction, transform } from "../transformer";

interface MetaData {
  group?: {
    path?: string;
    title?: string;
    order?: number
  },
  nav?: {
    path?: string;
    title?: string;
    order?: number
  },
  slugs: any[]
}

export const loadMarkdowns = async (root: string, resolve: ResolveFunction) => {
  const paths = detectMarkdowns(root)

  const transformResults = []

  for (let i = 0; i < paths.length; i++) {
    let markdown = paths[i]
    const file = await transform(markdown.id, resolve)
    transformResults.push({
      ...markdown,
      source: file.value,
      meta: file.data as unknown as MetaData
    })
  }

  return transformResults
}

const indexRE = /index$/

export const getMarkdowns = async (config: ResolvedConfig, resolve: ResolveFunction) => {

  const sources = await loadMarkdowns(config.root, resolve)
  const routePathRE = /(docs|src)\/([\/\w\d\-_\.]+)?\.md/

  return sources.reduce((routes, item) => {
    const routePath = routePathRE.exec(item.id)![2]
    const routePathPart = routePath.split('/')
    const curPath = routePathPart[routePathPart.length - 1]
    const specificPath = (item.meta.nav?.path || '') + (item.meta.group?.path || '')
    let path = '/' + (routePathPart.slice(0, routePathPart.length - 1).join('/') || specificPath)

    if (!indexRE.test(curPath)) {
      path += '/' + curPath
    }

    routes[path] = item
    return routes
  }, {} as Record<string, (typeof sources)[0]>)
}

export const generateRoutes = async (config: ResolvedConfig, resolve: ResolveFunction) => {

  const sources = await getMarkdowns(config, resolve)
  console.log("🚀 ~ file: routes.ts ~ line 66 ~ generateRoutes ~ sources", sources)
  const tries = buildingPathTrie(Object.keys(sources))
}