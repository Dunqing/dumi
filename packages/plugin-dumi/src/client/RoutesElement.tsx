import { matchRoutes, useLocation, renderMatches } from 'react-router-dom'
import { context } from '@dumi/theme'
import routes from 'virtual:dumi-routes'

const { Provider } = context


const RoutesElement = () => {
  console.log("🚀 ~ file: RoutesElement.tsx ~ line 3 ~ routes", routes)
  const location = useLocation()
  const matchResult = matchRoutes(routes, location)
  const element = renderMatches(matchResult)


  return <Provider value={{
    config: {
      mode: "side",
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
    menu: matchResult?.map(item => item.route),
  }}>{element}</Provider>
}

export default RoutesElement
