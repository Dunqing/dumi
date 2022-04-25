interface PathTrie {
  path: string
  children: PathTrie[]
}

export const buildingPathTrie = (keys: string[], prefix: string = '/') =>{
  const pathTrie: PathTrie[] = []
  const nextPrefix = new Set<string>()
  
  keys.forEach(key => {
    if (key.startsWith(prefix)) {
      const p = key.replace(prefix, '').split('/')[0]
      if (p) {
        nextPrefix.add(p)
      }
    }
  })

  nextPrefix.forEach((p) => {
    const np = `${prefix}${p}/`
    pathTrie.push({
      path: p,
      children: buildingPathTrie(keys.filter((k) => k.startsWith(np)), np)
    })
  })
  return pathTrie
}
