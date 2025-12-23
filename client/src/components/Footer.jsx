import { assets } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'
import { Twitter, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const { theme } = useTheme()
  return (
    <footer className='border-t border-border bg-background pt-24 pb-12 overflow-hidden relative'>

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className='max-w-7xl mx-auto px-6'>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20'>

          {/* Brand Column */}
          <div className='lg:col-span-1'>
            <div className="mb-6">
              {theme === 'dark' ? (
                <img src={assets.logo_light} alt="QuickBlog" className='w-32' />
              ) : (
                <img src={assets.logo} alt="QuickBlog" className='w-32' />
              )}
            </div>
            <p className='text-text-muted leading-relaxed mb-8'>
              The modern publishing platform for those who value speed, aesthetics, and clarity.
            </p>
            <div className='flex gap-4'>
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className='p-2 rounded-full border border-border text-text-muted hover:text-white hover:bg-primary hover:border-primary transition-all duration-300'>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className='lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8'>
            <div>
              <h4 className='font-bold text-text-main mb-6'>Product</h4>
              <ul className='space-y-4 text-sm text-text-muted'>
                {['Features', 'Integrations', 'Pricing', 'Changelog'].map(item => (
                  <li key={item}><a href="#" className='hover:text-primary transition-colors'>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className='font-bold text-text-main mb-6'>Resources</h4>
              <ul className='space-y-4 text-sm text-text-muted'>
                {['Documentation', 'API Reference', 'Community', 'Help Center'].map(item => (
                  <li key={item}><a href="#" className='hover:text-primary transition-colors'>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className='font-bold text-text-main mb-6'>Company</h4>
              <ul className='space-y-4 text-sm text-text-muted'>
                {['About', 'Blog', 'Careers', 'Legal'].map(item => (
                  <li key={item}><a href="#" className='hover:text-primary transition-colors'>{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter / CTA */}
          <div className='lg:col-span-1 p-6 rounded-2xl bg-surface border border-white/5'>
            <h4 className='font-bold text-text-main mb-2'>Subscribe</h4>
            <p className='text-xs text-text-muted mb-4'>Join our newsletter for the latest updates.</p>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-sm text-text-main focus:border-primary outline-none transition-colors" />
              <button className="w-full py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted'>
          <p>© 2025 QuickBlog Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-text-main transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text-main transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-text-main transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
