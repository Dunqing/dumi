import path from 'path'
import pEachSeries from 'p-each-series'
import type { Plugin } from 'unified'
import type { Visitor } from 'unist-util-visit/complex-types'
import { visit } from 'unist-util-visit'
import type { Element } from 'hast'
import { replaceElementToPreviewer } from '../utils/node'
import { analyzeDeps } from '../../parser'

export const previewer: Plugin<[], Element> = function() {
  return async(root, file, next) => {
    const nodes: Parameters<Visitor<Element, Element>>[] = []

    visit(root, {
      type: 'element',
      tagName: 'code',
    }, (node, index, parent) => {
      const src = node.properties?.src as string
      if (!src)
        return

      if (node.properties?.inline !== undefined && node.properties?.inline !== false) {
        node.tagName = 'CodeComponent'
        return
      }

      nodes.push([node, index, parent])
    })

    await pEachSeries(nodes, async([node, index, parent]) => {
      let src = node.properties!.src as string
      src = path.posix.join(file.dirname!, src)

      const deps = await analyzeDeps({
        path: src,
        resolve: (file.data.resolve) as any,
        importer: file.path,
      });

      ((file.data.additionalPreviewerProps || (file.data.additionalPreviewerProps = {})) as Record<string, typeof deps>)[src] = deps

      replaceElementToPreviewer([node, index, parent], {
        src,
      })
    })

    next(null, root, file)
  }
}
