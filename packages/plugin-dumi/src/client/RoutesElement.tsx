import { matchRoutes, useLocation, renderMatches } from 'react-router-dom'
import { context } from '@dumi/theme'
import { routes, nav } from 'virtual:dumi-provider'
import { useCurrentLocale } from './hooks'
console.log("🚀 ~ file: RoutesElement.tsx ~ line 4 ~ nav", nav)

const { Provider } = context


const RoutesElement = () => {
  const location = useLocation()
  const matchResult = matchRoutes(routes, location)
  const element = renderMatches(matchResult)

  const Config = {
    mode: "site",
    repository: {
      url: '',
      branch: 'main',
      platform: 'github'
    },
    locales: [['en-US', 'English'], ['zh-CN', '中文']] as [string, string][]
  }

  const locale = useCurrentLocale(Config.locales)


  return <Provider value={{
    config: Config,
    routes,
    nav: nav['zh-CN'],
    base: '/',
    locale,
    meta: matchResult?.[matchResult.length - 1].route.meta,
    menu: matchResult?.[matchResult.length - 2].route.children,
  }}>{element}</Provider>
}

export default RoutesElement
