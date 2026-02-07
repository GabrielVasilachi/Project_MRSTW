import Footer from './components/footer'
import Header from './components/header'
import { Outlet } from 'react-router-dom'

function App() { 
  return (
    <>
    <Header/>
    <main className='flex-auto'>
      <Outlet />
    </main>
    <Footer/>
    </>
  )
}

export default App
