import { Outlet } from 'react-router-dom'
import Sidebar from './components/dashboard/Sidebar'
import Header from './components/dashboard/Header'

function DashboardApp() { 
  return (
    <>
    <Header />
    <Sidebar/>
    <main className='flex-auto'>
      <Outlet />
    </main>
    </>
  )
}

export default DashboardApp
