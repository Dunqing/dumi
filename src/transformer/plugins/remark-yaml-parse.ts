import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { YAML } from 'mdast'
import { parse } from 'yaml'

export const { remarkYamlParse }: {
  remarkYamlParse: Plugin
} = {
  remarkYamlParse() {
    return (root) => {
      return visit(root, 'yaml', (node: YAML) => {
        const result = parse(node.value)
        node.data = result
      })
    }
  },
}
