import path from 'path'
import { VFile } from 'vfile'
import { describe, it } from 'vitest'
import { getSources } from '../sources'

describe('previewer', () => {
  it('sources', () => {
    const sources = getSources(path.resolve(__dirname, './fixtures/index.tsx'))
    console.log(sources)
  })
})
