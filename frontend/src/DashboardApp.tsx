import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/dashboard/Sidebar'
// import SwitchingUsers from './test/SwitchingUsers'

function DashboardApp() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsMobileMenuOpen(false)
			}
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		if (!isMobileMenuOpen) {
			document.body.style.overflow = ''
			return
		}

		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = ''
		}
	}, [isMobileMenuOpen])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
			<div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
				<button
					type="button"
					onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white"
					aria-label={isMobileMenuOpen ? 'Închide meniul lateral' : 'Deschide meniul lateral'}
					aria-expanded={isMobileMenuOpen}
				>
					<img src="/Logo-copy.svg" alt="Logo meniu" className="h-6 w-6" />
				</button>
			</div>

			<div className="flex flex-1 min-h-0">
				<Sidebar className="hidden md:block" />
				<main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
					<Outlet />
				</main>
			</div>

			{isMobileMenuOpen ? (
				<div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen(false)}
						className="absolute inset-0 bg-black/40"
						aria-label="Închide meniul lateral"
					/>
					<div className="relative h-full w-56 sm:w-64">
						<Sidebar className="h-full w-56 sm:w-64 shadow-xl" onNavigate={() => setIsMobileMenuOpen(false)} />
					</div>
				</div>
			) : null}

			{/* <SwitchingUsers /> */}
		</div>
  )
}

export default DashboardApp
