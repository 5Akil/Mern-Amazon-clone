import { RouterProvider } from 'react-router'
import MainRoutes from './Routs/MainRouts'


function App() {
  return (
    <>
      <RouterProvider router={MainRoutes} />
    </>
  )
}

export default App
