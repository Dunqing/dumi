import type { Plugin, ResolvedConfig } from 'vite'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import { transform } from './transformer'
import { generateRoutes} from './routes'
import path from 'path'

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
      if (id) {
        if (!filter(id))
          return undefined
      }
    },
    load(id) {
      if (id.includes(MARKDOWN_ENTRY)) {

        const routes = generateRoutes(config, this.resolve.bind(this))

        return {
          code: `
            import ${JSON.stringify(entryPath)}
          `,
          moduleSideEffects: false
        }
       }


      if (id.endsWith('.md')) {
        return transform(id, (id: string, importer?: string) => {
          return this.resolve(id, importer, {
            skipSelf: true,
          })
        })
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
