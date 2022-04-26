import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import { generateRoutes, transform } from './node'
import { transformSync } from 'esbuild'

interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

const MARKDOWN_ENTRY = 'MARKDOWN_ENTRY'

export default function plugin({ include = [], exclude = [] }: PluginOptions = {}): Plugin {
  const filter = createFilter(include, exclude)

  const entryPath = path.resolve(__dirname, '..', 'src', './client/index.tsx')

  let config: ResolvedConfig
  return {
    name: 'vite-plugin-dumi',
    enforce: 'pre',
    configResolved(_config) {
      config = _config
    },
    resolveId(id: string) {
      if (id === 'virtual:dumi-routes')
        return id

      if (id) {
        if (!filter(id))
          return undefined
      }
    },
    async load(id) {
      console.log("🚀 ~ file: index.ts ~ line 36 ~ load ~ id", id)
      if (id.includes(MARKDOWN_ENTRY)) {
        return {
          code: `
            import ${JSON.stringify(entryPath)}
          `,
          moduleSideEffects: false,
        }
      }

      if (id === 'virtual:dumi-routes') {
        return await generateRoutes(config, this.resolve.bind(this))

      }

      if (id.endsWith('.md')) {
        return transform(id, (id: string, importer?: string) => {
          return this.resolve(id, importer, {
            skipSelf: true,
          })
        }).then((res) => transformSync(res.value.toString(), {
          loader: 'tsx'
        }))
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
