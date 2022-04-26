import '@dumi/theme-default/style'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import RoutesElement from './RoutesElement'

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>loading~~~</div>}>
        <RoutesElement />
      </Suspense>
    </BrowserRouter >
  )
}

export default App
