import type { Plugin } from 'unified'
import { prettyPrint } from 'recast'
export const jsxStringify: Plugin = function() {
  this.Compiler = function(node) {
    return prettyPrint(node).code
  }
}
