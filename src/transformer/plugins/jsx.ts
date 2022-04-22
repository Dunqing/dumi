import type { Plugin } from 'unified'
import { toEstree } from 'hast-util-to-estree'

export const jsx: Plugin = function() {
  return function(node) {
    return toEstree(node, {
      handlers: {
      },
    })
  }
}
