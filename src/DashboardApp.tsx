import { Outlet } from 'react-router-dom'
import Sidebar from './components/dashboard/Sidebar'

function DashboardApp() { 
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
			<div className="flex flex-1 min-h-0">
				<Sidebar />
				<main className="flex-1 min-h-0 overflow-y-auto p-6">
					<Outlet />
				</main>
			</div>
		</div>
  )
}

export default DashboardApp
