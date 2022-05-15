import type { Plugin } from 'unified'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import type { Element } from 'hast'
import Slugger from 'github-slugger'

const headingRE = /h(1|2|3|4|5|6)/

const sluggerCache = new Map<string, Slugger>()

function filterValidChildren(children: any[]) {
  return children.filter((item) => {
    return item.type !== 'element' || !/^[A-Z]/.test(item.tagName)
  })
}

const getSlugger = (key: string) => {
  if (!sluggerCache.has(key)) sluggerCache.set(key, new Slugger())
  return sluggerCache.get(key)!
}

export const isHeading = function (element: any): element is Element {
  return headingRE.test((element as Element).tagName)
}

export const slug: Plugin = function () {
  return function (tree, file) {
    const slugger = getSlugger(file.path)
    slugger.reset()
    visit(tree, { type: 'element' }, (element) => {
      if (isHeading(element)) {
        const title = toString({
          children: filterValidChildren(element.children),
          value: (element as any).value,
        } as any)

        // // generate id if not exist
        element.properties = {
          id: slugger.slug(title.trim(), false),
          ...element.properties,
        }

        if (!file.data.title) file.data.title = title

        file.data.slugs = ((file.data.slugs as any[]) || []).concat({
          depth: parseInt(element.tagName[1], 10),
          value: title,
          heading: element.properties.id,
        })
      }
    })
  }
}
