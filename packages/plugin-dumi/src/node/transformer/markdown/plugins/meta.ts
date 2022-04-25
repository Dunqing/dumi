import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Root, YAML } from 'mdast'
import { parse } from 'yaml'

export const meta: Plugin = function() {
  return (root, file) => {
    return visit(root, 'yaml', (node: YAML, index, parent: Root) => {
      const result = parse(node.value)
      Object.assign(file.data, result)
      parent.children.splice(index, 1)
    })
  }
}
