import Footer from './components/footer'
import Header from './components/header'
import { Outlet } from 'react-router-dom'
import SwitchingUsers from './test/SwitchingUsers'

function LandingApp() { 
  return (
    <>
    <Header/>
    <main className='flex-auto'>
      <Outlet />
    </main>
    <Footer/>
    <SwitchingUsers />
    </>
  )
}

export default LandingApp
