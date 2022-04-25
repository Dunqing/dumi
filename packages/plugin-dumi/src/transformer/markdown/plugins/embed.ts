import { Parent } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const embed: Plugin = function() {
  return (root) => {
    return visit(root, {type: 'element', tagName: 'embed'}, (node, index, parent: Parent) => {
      parent.children.splice(index, 1)
    })
  }
}
