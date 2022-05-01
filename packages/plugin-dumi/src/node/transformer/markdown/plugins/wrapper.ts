import type { EstreeProgram } from 'hast-util-to-estree'
import type { Plugin } from 'unified'
import { template } from '@babel/core'
import type { ExpressionStatement } from '@babel/types'

export const wrapper: Plugin<[], EstreeProgram> = function() {
  return (root, file) => {
    const wrapperFn = template.program(`
      const children = %%CHILDREN%%;
      const meta = ${JSON.stringify(file.data)};

      return <Layout meta={meta}>
        <div className="markdown">{children}</div>
      </Layout>
    `, {
      plugins: ['jsx'],
    })

    return wrapperFn({
      CHILDREN: (root.body[0] as any as ExpressionStatement).expression,
    }) as any
  }
}
