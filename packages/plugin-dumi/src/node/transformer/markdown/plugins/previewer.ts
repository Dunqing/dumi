import path from 'path'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element, Parent } from 'hast'
import { replaceElementToPreviewer } from '../utils/node'

export const previewer: Plugin = function () {
  return (root, file) => {

    return visit(root, {
      type: 'element',
      tagName: 'code',
    }, (node: Element, index: number, parent: Parent) => {
      const src = node.properties?.src as string
      if (!src)
        return

      const codePath = path.posix.join(file.dirname!, src)

      file.data.previewers = Object.assign({}, file.data.previewers, {
        [src]: {
          path: codePath,
        },
      })

      if (node.properties?.inline !== undefined || node.properties?.inline !== false) {
        node.tagName = 'CodeComponent'
        return
      }

      replaceElementToPreviewer(node, parent, index)
    })
  }
}
