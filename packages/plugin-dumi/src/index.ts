import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import { transformSync } from 'esbuild'
import { dumiProvider, transform } from './node'

interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

const MARKDOWN_ENTRY = '/MARKDOWN_ENTRY.tsx'

export default function plugin({
  include = [],
  exclude = [],
}: PluginOptions = {}): Plugin {
  createFilter(include, exclude)

  const entryPath = path.resolve(
    path.dirname(import.meta.url.replace('file:///', '')),
    '..',
    'src',
    './client/index.tsx'
  )

  let config: ResolvedConfig
  return {
    name: 'vite-plugin-dumi',
    enforce: 'pre',
    configResolved(_config) {
      config = _config
    },
    resolveId(id: string) {
      if (id === 'virtual:dumi-provider') return id

      if (id === MARKDOWN_ENTRY) {
        return id
      }
    },
    async load(id) {
      if (id.includes(MARKDOWN_ENTRY)) {
        return {
          code: `
            import ${JSON.stringify(entryPath)}
          `,
          moduleSideEffects: false,
        }
      }

      if (id === 'virtual:dumi-provider')
        return await dumiProvider(config, this.resolve.bind(this))

      if (id.endsWith('.md')) {
        return transform(id, (id: string, importer?: string) => {
          return this.resolve(id, importer, {
            skipSelf: true,
          })
        }).then((res) =>
          transformSync(res.value.toString(), {
            loader: 'tsx',
          })
        )
      }
    },
    transformIndexHtml: {
      enforce: 'pre',
      transform: () => [
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
    },
  }
}
