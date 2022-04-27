import { URL } from 'url'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { hasProperty } from 'hast-util-has-property'
import {} from 'react-router-dom'
import type { Element } from 'hast'

/**
 * A URL pathname, beginning with a /.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
 */
export type Pathname = string

/**
 * A URL search string, beginning with a ?.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
 */
export type Search = string

/**
 * A URL fragment identifier, beginning with a #.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
 */
export type Hash = string

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
   */
  pathname: Pathname

  /**
   * A URL search string, beginning with a ?.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
   */
  search: Search

  /**
   * A URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
   */
  hash: Hash
}

export function parsePath(path: string): Partial<Path> {
  const parsedPath: Partial<Path> = {}

  if (path) {
    const hashIndex = path.indexOf('#')
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex)
      path = path.substr(0, hashIndex)
    }

    const searchIndex = path.indexOf('?')
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex)
      path = path.substr(0, searchIndex)
    }

    if (path)
      parsedPath.pathname = path
  }

  return parsedPath
}

export const link: Plugin = function() {
  return function(tree) {
    return visit(tree, { tagName: 'a', type: 'element' }, (node: Element) => {
      if (!hasProperty(node, 'href'))
        return

      const url = parsePath(node.properties!.href as string)
      if (url.hash) {
        node.tagName = 'AnchorLink'
        node.properties = {
          ...node.properties,
          to: node.properties!.href,
        }
      }
    })
  }
}
