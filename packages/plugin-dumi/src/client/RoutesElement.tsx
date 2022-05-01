import { matchRoutes, renderMatches, useLocation } from 'react-router-dom'
import { context } from '@dumi/theme'
import { nav, routes } from 'virtual:dumi-provider'
import { useCurrentLocale } from './hooks'

const { Provider } = context

const RoutesElement = () => {
  const location = useLocation()
  const matchResult = matchRoutes(routes, location)
  const element = renderMatches(matchResult)

  const Config = {
    mode: 'site',
    repository: {
      url: '',
      branch: 'main',
      platform: 'github',
    },
    locales: [['en-US', 'English'], ['zh-CN', '中文']] as [string, string][],
  }

  const [locale, isDefault] = useCurrentLocale(Config.locales)

  return <Provider value={{
    config: Config,
    routes,
    nav: nav[locale],
    base: `/${isDefault ? '' : locale}`,
    locale,
    meta: matchResult?.[matchResult.length - 1].route.meta,
    menu: matchResult?.[matchResult.length - 2].route.children,
  }}>{element}</Provider>
}

export default RoutesElement
