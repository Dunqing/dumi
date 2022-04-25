import { readFileSync } from 'fs'
import { traverse } from '@babel/core'
import { isIdentifier, isStringLiteral } from '@babel/types'
import type { ResolveFunction } from '../types'
import { getFilenameExt } from '../utils'
import { parseFile } from './parseCode'

const isRelativeRE = /^\.\//

const collectSources = (filePath: string) => {
  const ast = parseFile(filePath)!

  const temp = new Set<string>()

  if (ast) {
    traverse(ast as any, {
      ImportDeclaration(path) {
        temp.add(path.node.source.value)
      },
      CallExpression(path) {
        if (isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
          if (isStringLiteral(path.node.arguments[0]))
            temp.add(path.node.arguments[0].value)
        }
      },
    })
  }

  return Array.from(temp)
}

interface Sources {
  lang: string
  content: string
}

const allowExt = /(.m?tsx?|.m?jsx?)$/

export const analyzeDeps = async(filePath: string, resolve: ResolveFunction) => {
  const dependencies = new Set<string>()

  const traverseFiles = async(file: string) => {

    if (!allowExt.test(file)) return

    let filesMap: Record<string, string> = {}
    const sources = collectSources(file)

    const checkSource = async(id: string) => {
      const resolved = await resolve(id, filePath)
      if (resolved) {
        if (resolved.id.includes('node_modules'))
          return dependencies.add(id)
        if (isRelativeRE.test(id))
          filesMap[id] = resolved.id
      }
    }

    for (let i = 0; i < sources.length; i++) {
      const id = sources[i]
      await checkSource(id)
    }

    for (const file of Object.values(filesMap)) {
      filesMap = {
        ...filesMap,
        ...(await traverseFiles(file)),
      }
    }

    return filesMap
  }

  const filesMap = await traverseFiles(filePath)
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
      [`index.${getFilenameExt(filePath)}`]: {
        lang: getFilenameExt(filePath),
        content: readFileSync(filePath).toString(),
      },
      ...sources,
    },
    dependencies,
  }
}
