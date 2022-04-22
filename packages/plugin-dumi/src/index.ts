import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import glob from 'fast-glob'
import { transform } from './transformer'

interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

const MARKDOWN_ENTRY = 'MARKDOWN_ENTRY.tsx'

export default function plugin({ include = [], exclude = [] }: PluginOptions = {}): Plugin {
  const filter = createFilter(include, exclude)
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-dumi',
    enforce: 'pre',
    configResolved(_config) {
      config = _config
    },
    resolveId(id: string) {
      if (id) {
        if (!filter(id))
          return undefined
      }
    },
    load(id) {
      if (id.includes(MARKDOWN_ENTRY)) {
        const sources = glob.sync('**/*.md', {
          cwd: config.root,
          ignore: ['**/node_modules/**'],
        })

        return `
        import React, {Suspense} from 'react';
        import ReactDOM from 'react-dom';
        import { HashRouter, Routes, Route } from 'react-router-dom';
          ${sources.map(source => `import { default as Component1 } from '${
            normalizePath(path.posix.join(config.root, source))
          }'`).join('\n')}
          ReactDOM.render(
            <Suspense fallback={<div>loading~~~</div>}>
            <HashRouter>
            <Routes>
            <Route path="*" element={
                  <Component1 />
                }>
                </Route>
              </Routes>
            </HashRouter>,
            </Suspense>,
            document.getElementById('docs')
          )
        `
      }
      if (id.endsWith('.md'))
        return transform(id.replace('.md.tsx', '.md'))
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            injectTo: 'body-prepend',
            attrs: {
              type: 'module',
              src: MARKDOWN_ENTRY,
            },
          },
          {
            tag: 'div',
            injectTo: 'body',
            attrs: {
              id: 'docs',
            },
          },
        ],
      }
    },
  }
}
