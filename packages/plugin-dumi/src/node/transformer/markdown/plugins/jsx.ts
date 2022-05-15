import type { Plugin } from 'unified'
import { toEstree } from 'hast-util-to-estree'
import { prettyPrint } from 'recast'

export const jsx: Plugin = function () {
  this.Compiler = function (node) {
    return prettyPrint(node).code
  }

  return function (node) {
    return toEstree(node)
  }
}
