import path from 'path'
import glob from 'fast-glob'
import type { ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import { generateEntry } from './entry'

const detectMarkdowns = (root: string) => {
  const sources = glob.sync('**/*.md', {
    cwd: root,
    ignore: ['**/node_modules/**'],
  }).map((source) => {
    return normalizePath(path.posix.join(root, source))
  })
  return sources
}

const generateApp = (markdowns: string[]) => {
  const index = 0
  const imports = markdowns.map((m) => {
    return `import MarkdownComponents${index} from ${JSON.stringify(m)}`
  }).join('\n')
  let children = ''
  for (let i = 0; i <= index; i++)
    children += `<MarkdownComponents${i} />\n`

  return `
    import React, {Suspense} from 'react';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    ${imports}
    const App = () => {
      return (
        <Suspense fallback={<div>loading~~~</div>}>
          <BrowserRouter>
            <Routes>
              ${children}
            </Routes>
          </BrowserRouter>
        </Suspense>
      )
    }`
}

export const generateMarkdownEntry = (config: ResolvedConfig) => {
  return generateEntry(
    generateApp(
      detectMarkdowns(config.root),
    ),
  )
}
