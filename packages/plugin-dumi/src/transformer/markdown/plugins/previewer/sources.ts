import { readFileSync } from 'fs'
import { isIdentifier, isStringLiteral } from '@babel/types'
import { transformFileSync, traverse } from '@babel/core'
import type { VFile } from 'vfile'
import { transformSync } from 'esbuild'

export const getSources = (filePath: string) => {
  const result = transformFileSync(filePath, {
    ast: true,
    presets: [
      '@babel/preset-typescript',
    ],
  })

  if (result) {
    traverse(result.ast, {
      ImportDeclaration(path) {
        console.log(path.node.source.value)
      },
      CallExpression(path) {
        if (isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
          if (isStringLiteral(path.node.arguments[0]))
            console.log(path.node.arguments[0].value)
        }
      },
    })
  }
}

export const getDependencies = () => {

}
