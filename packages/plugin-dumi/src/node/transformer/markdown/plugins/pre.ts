import type { Plugin } from 'unified'
import type { Element } from 'hast'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
export const pre: Plugin<[], Element> = () => {
  return (node) => {
    visit(node, { type: 'element', tagName: 'pre' }, (element) => {
      if (element.properties?.lang) {
        element.children = [
          {
            type: 'element',
            tagName: 'code',
            data: {
              pure: true,
            },
            properties: {
              className: [`language-${element.properties?.lang}`],
            },
            position: element.children[0]?.position,
            children: [
              {
                type: 'text',
                value: toString(element),
              },
            ],
          },
        ]
      }
    })
  }
}
