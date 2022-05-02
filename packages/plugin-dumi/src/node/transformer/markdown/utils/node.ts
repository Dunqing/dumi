import type { Element } from 'hast'
import type { Visitor } from 'unist-util-visit/complex-types'

export const replaceElementToPreviewer = ([node, index, parent]: Parameters<Visitor<Element, Element>>, codeComponentProperties) => {
  parent!.children.splice(index!, 1, {
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
  })
}
