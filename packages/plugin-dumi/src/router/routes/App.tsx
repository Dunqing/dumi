import { Suspense } from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'

export const App = () => {
  return (
    <Suspense fallback={<div>loading~~~</div>}>
      <BrowserRouter>
        <Routes>
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}
