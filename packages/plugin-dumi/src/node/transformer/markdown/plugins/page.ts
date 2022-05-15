import type { EstreeProgram } from 'hast-util-to-estree'
import type { Plugin } from 'unified'
import { template, traverse } from '@babel/core'
import type {
  ExpressionStatement,
  Statement,
  StringLiteral,
} from '@babel/types'
import { isJSXAttribute, isJSXElement, isJSXIdentifier } from '@babel/types'
import { exportDefaultToConst } from '../../parser'

const replaceCodeComponent = (ast: EstreeProgram) => {
  let index = 0
  const dependencies: Statement[] = []
  traverse(ast as any, {
    JSXOpeningElement(path) {
      if (isJSXIdentifier(path.node.name)) {
        if (path.node.name.name === 'CodeComponent') {
          const { source, src } = path.node.attributes.reduce((obj, attr) => {
            if (isJSXAttribute(attr)) {
              if (isJSXIdentifier(attr.name))
                return {
                  ...obj,
                  [attr.name.name]: (attr.value as StringLiteral).value,
                }
            }
            return obj
          }, {} as Record<'source' | 'src', string>)

          if (isJSXElement(path.parentPath.node)) {
            const name = `CodeComponent${++index}`

            path.parentPath.replaceWith(
              template.ast(`\<${name} />`, {
                plugins: ['jsx'],
              }) as Statement
            )

            dependencies.push(
              ...[
                template.ast(
                  source
                    ? `${exportDefaultToConst(source, 'tsx', name)}`
                    : `import ${name} from ${JSON.stringify(src)}`
                ),
              ].flat(1)
            )
          }
        }
      }
    },
  })

  return dependencies
}

export const page: Plugin<[], EstreeProgram> = function () {
  return (ast, file) => {
    const dependencies = replaceCodeComponent(ast)

    return template.program(
      `
      import React, { lazy, useCallback } from 'react';
      import { AnchorLink } from '@dumi/theme'
      import { Previewer as ThemePreviewer, Layout, SourceCode } from '@dumi/theme-default'

      %%DEPENDENCIES%%

      const additionalPreviewerProps = ${JSON.stringify(
        file.data.additionalPreviewerProps
      )}

      const Previewer = (props) => {
        return <ThemePreviewer {...props} {...Reflect.get(additionalPreviewerProps, props.src)} />
      }

      const children = %%CHILDREN%%;
      const meta = ${JSON.stringify(file.data)};

      export default function markdown() {
        return (
          <Layout meta={meta}>
            <div className="markdown">{children}</div>
          </Layout>
        )
      }
    `,
      {
        plugins: ['jsx'],
      }
    )({
      CHILDREN: (ast.body[0] as any as ExpressionStatement).expression,
      DEPENDENCIES: dependencies,
    }) as any
  }
}
