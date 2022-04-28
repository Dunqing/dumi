import { readFileSync } from 'fs'
import type { Loader } from 'esbuild'
import { transformSync } from 'esbuild'
import { parseSync } from '@babel/core'

const extRE = /\.(tsx?|jsx?)$/

export const parseFile = (filePath: string): any => {
  const source = readFileSync(filePath).toString()
  const ext = extRE.exec(filePath)?.[1]
  try {
    const transformResult = transformSync(source, {
      loader: (ext as Loader) || 'tsx',
    })
    return parseSync(transformResult.code)

  } catch (err) {
    console.log("🚀 ~ file: parseCode.ts ~ line 18 ~ parseFile ~ err", filePath, source)
  }
}

export const parseCode = (code: string, ext?: Loader): any => {
  const transformResult = transformSync(code, {
    loader: (ext as Loader) || 'tsx',
  })
  return parseSync(transformResult.code)
}
