import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Demo from '@/pages/Demo'
import NotFound from '@/pages/NotFound'
import BaseLayout from '@/components/BaseLayout'
import { DevTools as JotaiDevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'

function App() {
  return (
    <>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<BaseLayout disableHeader disableFooter />}>
          <Route path="/minimal" element={<>Test</>} />
        </Route>
      </Routes>
      <JotaiDevTools />
    </>
  )
}

export default App
