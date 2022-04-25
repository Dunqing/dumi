import type { Element } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface Meta {
  pure?: true
}

const parseMeta = (meta?: string): Meta => {
  return (meta || '').split('|').reduce((m: Record<any, true>, k) => {
    m[k.trim()] = true
    return m
  }, {})
}

export const codeblock: Plugin<[]> = function() {
  return (root) => {
    return visit(root, { type: 'element', tagName: 'code' }, (node: Element) => {
      const meta = parseMeta(node.data?.meta as string)
      if (meta.pure)
        node.tagName = 'Demo'
    })
  }
}
