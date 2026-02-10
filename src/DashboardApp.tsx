import Sidebar from './components/dashboard/Sidebar'
import { Outlet } from 'react-router-dom'

function DashboardApp() { 
  return (
    <>
    <Sidebar/>
    <main className='flex-auto'>
      <Outlet />
    </main>
    </>
  )
}

export default DashboardApp
