import path from 'path'
import { readFileSync } from 'fs'
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

const MARKDOWN_ENTRY = 'MARKDOWN_ENTRY'

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
          ${sources.map(source => `import '${
            normalizePath(path.posix.join(config.root, source))
          }'`).join('\n')}
        `
      }

      if (id.endsWith('.md')) {
        transform(
          readFileSync(id).toString(),
        )
        return ''
      }
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
        ],
      }
    },
  }
}
