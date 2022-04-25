import { readFileSync } from 'fs'
import { transformSync } from 'esbuild'
import { VFile } from 'vfile'
import { transformMarkdown } from './markdown'
import type { ResolveFunction } from './types'

export * from './types'

export async function transform(id: string, resolve: ResolveFunction) {
  const file = new VFile({
    path: id,
    value: readFileSync(id).toString(),
  })
  file.value = await transformMarkdown(file, resolve)
  return file
}
