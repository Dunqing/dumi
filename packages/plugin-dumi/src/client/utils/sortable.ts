export const sortable = (items?: any[]) => {
  return items?.sort((prev, next) => {
    const prevOrder = typeof prev.order === 'number' ? prev.order : Infinity
    const nextOrder = typeof next.order === 'number' ? next.order : Infinity
    // compare order meta config first
    const metaOrder = prevOrder === nextOrder ? 0 : prevOrder - nextOrder
    // last compare path length
    const pathOrder = prev.path.length - next.path.length
    // then compare title ASCII
    const ascOrder =
      prev.title > next.title ? 1 : prev.title < next.title ? -1 : 0
    return metaOrder || pathOrder || ascOrder
  })
}
