import { analyzeDeps } from '../../../parser'
export const getSources = (filePath: string) => {
  return analyzeDeps(filePath)
}

export const getDependencies = () => {

}
