import type { Element } from 'hast'
import type { Properties } from 'hast-util-to-estree'
import { is } from 'unist-util-is'
import type { Visitor } from 'unist-util-visit/complex-types'

export const replaceElementToPreviewer = (
  [node, index, parent]: Parameters<Visitor<Element, Element>>,
  codeComponentProperties: Properties
) => {
  const nextElement: Element = {
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
        properties: codeComponentProperties,
        children: [],
      },
    ],
  }

  if (is(parent, { type: 'element', tagName: 'pre' }))
    return Object.assign(parent, nextElement)

  parent!.children.splice(index!, 1, nextElement)
}
