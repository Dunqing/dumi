import { readFileSync } from 'fs'
import type { Loader } from 'esbuild'
import { transformSync } from 'esbuild'
import { parseSync } from '@babel/core'

const extRE = /\.(tsx?|jsx?)$/

export const parseFile = (filePath: string): any => {
  const source = readFileSync(filePath).toString()
  const ext = extRE.exec(filePath)?.[1]
  const transformResult = transformSync(source, {
    loader: (ext as Loader) || 'tsx',
  })
  return parseSync(transformResult.code)
}
