import React from 'react'

const Loader = () => {
    return (

        <div className="flex items-center justify-center h-screen ">
            <div className="relative w-20 h-20">
                {/* Outer Ring */}
                <div className="absolute w-full h-full rounded-full border-4 border-t-transparent border-purple-500 animate-spin"></div>
                {/* Inner Glow Ring */}
                {/* <div className="absolute w-full h-full rounded-full border-4 border-b-transparent border-pink-500 animate-spin-slow"></div> */}
                {/* Center Dot */}
                <div className="absolute inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
        </div>

    )
}

export default Loader
