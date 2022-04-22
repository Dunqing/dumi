import type { Plugin } from 'unified'
import recast from 'recast'

export const jsxStringify: Plugin = function() {
  this.Compiler = function(node) {
    return recast.prettyPrint(node).code
  }
}
