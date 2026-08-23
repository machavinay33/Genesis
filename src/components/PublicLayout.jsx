import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function PublicLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />
      <main key={pathname} className="page-transition flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
