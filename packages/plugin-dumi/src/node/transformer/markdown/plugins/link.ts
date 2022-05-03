import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { hasProperty } from 'hast-util-has-property'
import { parsePath } from 'react-router-dom'
import type { Element } from 'hast'

export const link: Plugin = function() {
  return function(tree) {
    return visit(tree, { tagName: 'a', type: 'element' }, (node: Element) => {
      if (!hasProperty(node, 'href'))
        return

      const url = parsePath(node.properties!.href as string)
      if (url.hash) {
        node.tagName = 'AnchorLink'
        node.properties = {
          ...node.properties,
          to: node.properties!.href,
        }
      }
    })
  }
}
