import type { Element, Parent } from 'hast'

export const replaceElementToPreviewer = (node: Element, parent: Parent, index) => {
  parent.children.splice(index, 1, {
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
        properties: {
          src: node.properties?.src,
        },
        children: [],
      },
    ],
  })
}
