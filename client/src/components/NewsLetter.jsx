import React from 'react'

const NewsLetter = () => {
  return (
    <div className='flex flex-col items-center justify-center  text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold text-text-main'>Never Miss a Blog!</h1>
      <p className='md:text-lg text-text-muted pb-8'>Subscribe to get the latest blog, new tech, and exclusive news.</p>
      <form className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12 shadow-lg shadow-black/5'>
        <input className='bg-surface border border-border border-r-0 rounded-l-md h-full outline-none w-full px-4 text-text-main placeholder:text-text-muted/50 focus:border-primary transition-colors' type="text" placeholder='Enter your email address' required />
        <button className='md:px-12 px-8 h-full bg-primary text-white hover:bg-primary/90 transition-all cursor-pointer rounded-md rounded-l-none font-bold hover:scale-105 active:scale-95' type="submit">SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsLetter
