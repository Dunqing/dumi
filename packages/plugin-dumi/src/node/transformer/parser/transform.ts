import { traverse } from "@babel/core"
import { isClassExpression, Identifier, variableDeclarator, identifier, variableDeclaration } from "@babel/types"
import { Loader } from "esbuild"
import { parseCode } from "./parseCode"
import generate from '@babel/generator'


export const exportDefaultToConst = (code: string, ext: Loader, name: string) => {
  const ast = parseCode(code, ext)
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (!isClassExpression(path.node.declaration)) {
        path.replaceWith(variableDeclaration(
          "const",
          [
            variableDeclarator(identifier(name), path.node.declaration as Identifier)
          ]
        ))
      }
    }
  })

  return generate(ast).code
}