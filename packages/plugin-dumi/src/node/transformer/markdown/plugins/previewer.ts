import path from 'path'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element, Parent } from 'hast'

export const previewer: Plugin = function() {
  return (root, file) => {
    return visit(root, {
      type: 'element',
      tagName: 'code',
    }, (node: Element, index: number, parent: Parent) => {
      const src = node.properties?.src as string
      if (!src)
        return

      const codePath = path.posix.join(file.dirname!, src)

      file.data.components = Object.assign({}, file.data.components, {
        [src]: codePath,
      })

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'Previewer',
        properties: {
          ...node.properties,
        },
        position: node.position,
        children: [
          {
            type: 'element',
            tagName: 'CodeComponent',
            properties: {
              src: node.properties?.src,
            },
            children: [],
          },
        ],
      })
    })
  }
}
