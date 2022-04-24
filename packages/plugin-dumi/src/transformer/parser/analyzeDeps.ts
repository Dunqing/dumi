import { traverse } from '@babel/core'
import { isIdentifier, isStringLiteral } from '@babel/types'
import { parseFile } from './parseCode'

const isRelativeRE = /^\.\//

export const analyzeDeps = (filePath: string) => {
  const ast = parseFile(filePath)!

  const files = new Set<string>()
  const dependencies = new Set<string>()

  const checkSource = (src: string) => {
    if (isRelativeRE.test(src))
      files.add(src)
    else
      dependencies.add(src)
  }

  if (ast) {
    traverse(ast as any, {
      ImportDeclaration(path) {
        checkSource(path.node.source.value)
      },
      CallExpression(path) {
        if (isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
          if (isStringLiteral(path.node.arguments[0]))
            checkSource(path.node.arguments[0].value)
        }
      },
    })
  }
  return {
    files: files.values(),
    dependencies: dependencies.values(),
  }
}
