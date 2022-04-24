export const getFilenameExt = (filePath: string) => {
  return /\.([\w\.]+)g/.exec(filePath)?.[1] || 'tsx'
}
