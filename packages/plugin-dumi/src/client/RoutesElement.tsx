import { useRoutes } from 'react-router-dom'
import routes from 'virtual:dumi-routes'

const RoutesElement = () => {
  const element = useRoutes(routes)

  return <>{element}</>
}

export default RoutesElement
