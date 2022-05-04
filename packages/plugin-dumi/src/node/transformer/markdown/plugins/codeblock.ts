import type { Element } from 'hast'
import { toString } from 'hast-util-to-string'
import pEachSeries from 'p-each-series'
import type { Plugin } from 'unified'
import type { Visitor } from 'unist-util-visit/complex-types'
import { is } from 'unist-util-is'
import { visit } from 'unist-util-visit'
import { analyzeDeps } from '../../parser'
import { replaceElementToPreviewer } from '../utils/node'

interface Meta {
  pure?: true
}

const parseMeta = (meta?: string): Meta => {
  return (meta || '').split('|').reduce((m: Record<any, true>, k) => {
    if (!k.trim())
      return m
    m[k.trim()] = true
    return m
  }, {})
}

export const codeblock: Plugin<[], Element> = function() {
  const allowPreviewerLangs = ['tsx', 'jsx']
  return async(root, file, next) => {
    const nodes: Parameters<Visitor<Element, Element>>[] = []
    let codeblockIndex = 0

    visit(root, { type: 'element', tagName: 'code' }, (node, index, parent) => {
      const meta = { ...parseMeta(node.data?.meta as string), ...node.data }
      const lang = (node.properties?.className as string[])?.map((name: string) => name.startsWith('language-') && name.slice(9)).filter(Boolean)?.[0]

      if (!lang)
        return

      if (!meta.pure && allowPreviewerLangs.includes(lang)) {
        const src = `codeblockPreviewer${++codeblockIndex}.${lang}`

        node.properties = {
          ...node.properties,
          src,
        }

        nodes.push([node, index, parent])
      }
      else {
        node.tagName = 'SourceCode'
        node.properties = {
          lang,
        }
        if (is(parent, { type: 'element', tagName: 'pre' }))
          Object.assign(parent, node)
      }
    })

    await pEachSeries(nodes, async([node, index, parent]) => {
      const src = node.properties!.src as string
      const source = toString(node)

      const deps = await analyzeDeps({
        resolve: (file.data.resolve) as any,
        source,
        importer: file.path,
      });

      ((file.data.additionalPreviewerProps || (file.data.additionalPreviewerProps = {})) as Record<string, typeof deps>)[src] = deps
      replaceElementToPreviewer([node, index, parent], {
        source,
      })
    })

    next(null, root, file)
  }
}
