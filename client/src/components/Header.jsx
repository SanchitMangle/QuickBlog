import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Sparkles, ArrowDown } from 'lucide-react'

const Header = () => {
    return (
        <div className='relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden px-8 pt-32 md:pt-40'>

            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className='text-center max-w-4xl mx-auto'
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border text-primary text-sm font-medium mb-8 backdrop-blur-sm'
                >
                    <Sparkles size={14} className="fill-primary" />
                    <span>AI-Powered Publishing</span>
                </motion.div>

                {/* Title */}
                <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text-main mb-8'>
                    Your thoughts, <br />
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400'>amplified.</span>
                </h1>

                {/* Subtitle */}
                <p className='text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-12'>
                    The modern space to share stories, ideas, and expertise.
                    Built for writers who value aesthetics, speed, and clean design.
                </p>

                {/* Action - Scroll Down Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className='text-text-muted/50'
                >
                    <ArrowDown size={24} className="mx-auto" />
                </motion.div>

            </motion.div>
        </div>
    )
}

export default Header
