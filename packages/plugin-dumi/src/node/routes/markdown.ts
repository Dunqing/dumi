import path from "path"
import { normalizePath } from "vite"
import glob from 'fast-glob'

export const detectMarkdowns = (root: string) => {
  const paths = glob.sync(['docs/**/*.md', 'src/**/*.md'], {
    cwd: root,
    ignore: ['**/node_modules/**'],
  }).map((p) => {
    return {
      id: normalizePath(p),
      path: normalizePath(path.posix.join(root, p))
    }
  })
  return paths
}

