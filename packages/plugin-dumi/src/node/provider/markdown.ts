import path from 'path'
import { normalizePath } from 'vite'
import glob from 'fast-glob'
import type { ResolveFunction } from '../transformer'
import { transform } from '../transformer'

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

export const detectMarkdowns = (root: string) => {
  const paths = glob.sync(['docs/**/*.md', 'src/**/*.md'], {
    cwd: root,
    ignore: ['**/node_modules/**'],
  }).map((p) => {
    return {
      id: normalizePath(p),
      path: normalizePath(path.posix.join(root, p)),
    }
  })
  return paths
}

export const loadMarkdowns = async(root: string, resolve: ResolveFunction) => {
  const paths = detectMarkdowns(root)

  const transformResults = []

  for (let i = 0; i < paths.length; i++) {
    const markdown = paths[i]
    const file = await transform(markdown.path, resolve)
    transformResults.push({
      ...markdown,
      meta: file.data as unknown as MetaData,
    })
  }

  return transformResults
}
