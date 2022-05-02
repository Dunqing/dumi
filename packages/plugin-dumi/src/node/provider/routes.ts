import type { loadMarkdowns } from './markdown'

type PickPromiseType<T> = T extends Promise<infer U> ? U : T
type SourcesType = PickPromiseType<ReturnType<typeof loadMarkdowns>>

export const generateRoutes = (Sources: SourcesType) => {
  return `
      const buildingRoutes = () => {
        const __runtimeComponent__ = (src) => {
          switch (src) {
            ${
              Sources.map((s) => {
                return `case ${JSON.stringify(s.id)}: return lazy(() => import(${JSON.stringify(s.path)}));`
              }).join('\n')
            }
          }
        }

      const indexRE = /index$/
      const routes: RouteObject[] = [];

        Sources.forEach((item) => {
          const { paths } = parsedPath(item)
          let curRoutes = routes
          paths.forEach((p, index) => {
            let cr = curRoutes.find(r => r.path === (p || '/'))
            const children: RouteObject[] = cr?.children || []
            const isIndex = indexRE.test(p)

            if (!cr) {
              cr = {
                path: isIndex ? undefined : p || '/',
                children,
                index: isIndex,
              }
              curRoutes.push(cr)
            }
            if (index === paths.length - 1) {
              let Component = __runtimeComponent__(item.id)
              Object.assign(cr, {
                path: isIndex ? paths.slice(0, -1).join('/') || '/' : paths.join('/'),
                element: <Component />,
                index: isIndex,
                title: item.meta?.title,
                meta: item.meta
              })
            }
            curRoutes = children
          })
        })

      return routes
    }

    export const routes = buildingRoutes()
  `
}

export const generateNav = () => {
  return `
    function generateNav() {
      const localesNav = {}
      Sources.filter(s => s.meta.nav).forEach((source) => {
        const { paths, locale } = parsedPath(source)
        const navList = (localesNav[locale] || ( localesNav[locale] = []));
        const nav = {
          ...source.meta?.nav,
          path: paths.slice(0, -1).join('/'),
        }
        navList.push(nav)
      })
      Object.keys(localesNav).forEach((locale) => {
        localesNav[locale] = localesNav[locale].sort((prev, next) => {
          const prevOrder = typeof prev.order === 'number' ? prev.order : Infinity;
          const nextOrder = typeof next.order === 'number' ? next.order : Infinity;
          // compare order meta config first
          const metaOrder = prevOrder === nextOrder ? 0 : prevOrder - nextOrder;
          // last compare path length
          const pathOrder = prev.path.length - next.path.length;
          // then compare title ASCII
          const ascOrder = prev.title > next.title ? 1 : prev.title < next.title ? -1 : 0;
          return metaOrder || pathOrder || ascOrder;
        })
      })
      return localesNav
    }

    export const nav = generateNav()
  `
}
