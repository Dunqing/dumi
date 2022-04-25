import "@dumi/theme-default/style"
import { Suspense } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>loading~~~</div>}>
        <Routes>
          {/* TODO: insert route */}
        </Routes>
      </Suspense>
    </BrowserRouter >
  )
}

export default App