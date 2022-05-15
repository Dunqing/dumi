import { readFileSync } from 'fs'
import type { Node } from '@babel/core'
import { traverse } from '@babel/core'
import { isIdentifier, isStringLiteral } from '@babel/types'
import type { ResolveFunction } from '../types'
import { getFilenameExt } from '../utils'
import { parseCode, parseFile } from './parseCode'

const isRelativeRE = /^\.\//

const collectSources = (ast: Node) => {
  const temp = new Set<string>()

  if (ast) {
    traverse(ast as any, {
      ImportDeclaration(path) {
        temp.add(path.node.source.value)
      },
      CallExpression(path) {
        if (
          isIdentifier(path.node.callee) &&
          path.node.callee.name === 'require'
        ) {
          if (isStringLiteral(path.node.arguments[0]))
            temp.add(path.node.arguments[0].value)
        }
      },
    })
  }

  return Array.from(temp)
}

const allowExt = /(.m?tsx?|.m?jsx?)$/

interface AnalyzeDepsOptions {
  path?: string
  source?: string
  // source lang
  lang?: string
  importer?: string
  resolve: ResolveFunction
}

export const analyzeDeps = async ({
  resolve,
  ...options
}: AnalyzeDepsOptions) => {
  const dependencies = new Set<string>()

  const traverseFiles = async ({
    path,
    source,
    importer,
  }: Omit<AnalyzeDepsOptions, 'resolve'>) => {
    if (path && !allowExt.test(path)) return

    let filesMap: Record<string, string> = {}
    const sources = collectSources(path ? parseFile(path) : parseCode(source!))

    const checkSource = async (id: string) => {
      const resolved = await resolve(id, path || importer)
      if (resolved) {
        if (resolved.id.includes('node_modules')) return dependencies.add(id)
        if (isRelativeRE.test(id)) filesMap[id] = resolved.id
      }
    }

    for (let i = 0; i < sources.length; i++) {
      const id = sources[i]
      await checkSource(id)
    }

    for (const p of Object.values(filesMap)) {
      filesMap = {
        ...filesMap,
        ...(await traverseFiles({
          path: p,
        })),
      }
    }

    return filesMap
  }

  const filesMap = (await traverseFiles(options)) || {}
  const sources = Object.keys(filesMap).reduce((res, key) => {
    const path = filesMap[key]
    const fileName = key.includes('.') ? key : `${key}.${getFilenameExt(path)}`
    return {
      ...res,
      [fileName]: {
        lang: getFilenameExt(path),
        content: readFileSync(path).toString(),
      },
    }
  }, {})

  return {
    sources: {
      [`index.${options.path ? getFilenameExt(options.path) : options.lang}`]: {
        lang: options.lang,
        content: options.path
          ? readFileSync(options.path).toString()
          : options.source,
      },
      ...sources,
    },
    dependencies,
  }
}
