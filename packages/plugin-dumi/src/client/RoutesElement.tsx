import { matchRoutes, useLocation, renderMatches } from 'react-router-dom'
import { context } from '@dumi/theme'
import routes from 'virtual:dumi-routes'

const { Provider } = context


const RoutesElement = () => {
  const location = useLocation()
  const matchResult = matchRoutes(routes, location)
  const element = renderMatches(matchResult)

  console.log(matchResult?.map(item => item.route))

  return <Provider value={{
    config: {
      mode: "site",
      repository: {
        url: '',
        branch: 'main',
        platform: 'github'
      },
      locales: [['en-US', 'English'], ['zh-CN', '中文']]
    },
    routes,
    nav: [],
    meta: matchResult?.[matchResult.length - 1].route.meta,
    menu: matchResult?.[matchResult.length - 2].route.children,
  }}>{element}</Provider>
}

export default RoutesElement
