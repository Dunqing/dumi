import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { YAML } from 'mdast'
import { parse } from 'yaml'

export const remarkYamlData: Plugin = function() {
  return (root, file) => {
    return visit(root, 'yaml', (node: YAML) => {
      const result = parse(node.value)
      file.data.metadata = result
    })
  }
}
