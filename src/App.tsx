import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Promos from './pages/Promos'
import Contact from './pages/Contact'

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path='/contact/:id' element={<Contact />} />
      <Route path='/search' element={<Search />} />
      <Route path='/promos' element={<Promos />} />
    </Route>
    
    <Route path='*' element="Not Found" />
  </>
))

const App = () => {
  return (
      <RouterProvider router={router} />
  )
}

export default App
