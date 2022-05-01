import type { Element } from 'hast'
import { toString } from 'hast-util-to-string'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { replaceElementToPreviewer } from '../utils/node'

interface Meta {
  pure?: true
}

const parseMeta = (meta?: string): Meta => {
  return (meta || '').split('|').reduce((m: Record<any, true>, k) => {
    if (!k.trim())
      return m
    m[k.trim()] = true
    return m
  }, {})
}

export const codeblock: Plugin<[]> = function() {
  let codeblockIndex = 0
  const allowPreviewerLangs = ['tsx', 'jsx']
  return (root, file) => {
    return visit(root, { type: 'element', tagName: 'code' }, (node: Element, index, parent) => {
      const meta = parseMeta(node.data?.meta as string)
      const lang = (node.properties?.className as string[])?.map((name: string) => name.startsWith('language-') && name.slice(9)).filter(Boolean)?.[0]

      if (!lang)
        return

      if (meta.pure) {
        node.tagName = 'SourceCode'
        node.properties = {
          lang: lang[0],
        }
        return
      }
      if (allowPreviewerLangs.includes(lang)) {
        const src = `codeblockPreviewer${++codeblockIndex}.${lang}`

        node.properties = {
          ...node.properties,
          src,
        }

        const previewers: any = (file.data.previewers || (file.data.previewers = {}))
        previewers[src] = {
          source: toString(node),
        }

        replaceElementToPreviewer(node, parent, index)
      }
    })
  }
}
