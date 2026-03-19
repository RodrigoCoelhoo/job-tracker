import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'
import Login from '../pages/Login'
import AuthCallback from '../pages/AuthCallback'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

      </Route>
    </>
  )
)

export default function AppRouter() {
  return <RouterProvider router={router} />
}