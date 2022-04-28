import type { Element } from 'hast'
import { toString } from 'hast-util-to-string'
import type { Plugin } from 'unified'
import { Parent, visit } from 'unist-util-visit'

interface Meta {
  pure?: true
}

const parseMeta = (meta?: string): Meta => {
  return (meta || '').split('|').reduce((m: Record<any, true>, k) => {
    if (!k.trim()) return m
    m[k.trim()] = true
    return m
  }, {})
}

export const codeblock: Plugin<[]> = function() {
  return (root) => {
    return visit(root, { type: 'element', tagName: 'code' }, (node: Element) => {
      const meta = parseMeta(node.data?.meta as string)
      const lang = (node.properties?.className as string[])?.map((name: string) => name.startsWith('language-') && name.slice(9)).filter(Boolean)
      if (meta.pure && lang?.length) {
        node.tagName = 'SourceCode'
        node.properties = {
          lang: lang[0]
        }
      }
    })
  }
}
