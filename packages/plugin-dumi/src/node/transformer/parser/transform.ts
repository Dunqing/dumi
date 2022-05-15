import { traverse } from '@babel/core'
import type { Identifier } from '@babel/types'
import {
  identifier,
  isClassExpression,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types'
import type { Loader } from 'esbuild'
import generate from '@babel/generator'
import { parseCode } from './parseCode'

export const exportDefaultToConst = (
  code: string,
  ext: Loader,
  name: string
) => {
  const ast = parseCode(code, ext)
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (!isClassExpression(path.node.declaration)) {
        path.replaceWith(
          variableDeclaration('const', [
            variableDeclarator(
              identifier(name),
              path.node.declaration as Identifier
            ),
          ])
        )
      }
    },
  })

  return generate(ast).code
}
