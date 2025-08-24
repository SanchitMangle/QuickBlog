import React from 'react'
import {assets} from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'

const Navbar = () => {

   
    const {navigate,token} = useAppContext()

  return (
    <div className='flex items-center justify-between py-5 mx-8 sm:mx-20 xl:mx-32 cursor-pointer'>
      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='w-32 sm:w-44 cursor-pointer'/>
      <button className='flex items-center gap-2 rounded-full  test-sm cursor-pointer bg-primary text-white px-10 py-2.5' onClick={()=>navigate('/admin')}>
        {token ? "Dashboard" : "Login"} 
        <img src={assets.arrow} className='w-3' alt="" />
      </button>
    </div>
  )
}

export default Navbar
