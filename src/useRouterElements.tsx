import { useRoutes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import MainLayout from './Layouts/MainLayout/MainLayout'

const useRouterElements = () => {
  const routeElemnts = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: '/analytics',
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: '/calendar',
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: '/image',
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: '/setings',
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    }
  ])
  return routeElemnts
}

export default useRouterElements
