import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Sparkles, Minimize2, RefreshCcw } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AIAssistant = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'system', content: "Hello! I'm Antigravity. How can I assist you with your blog today?" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const { axios } = useAppContext()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen])

    // Context gathering (Simplified for now, in a real app better to pass as props or store)
    const getContext = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard')
            return data.success ? data.dashboardData : null
        } catch (error) {
            return null
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            // Fetch context just in time
            const context = await getContext()

            const { data } = await axios.post('/api/ai/chat', {
                prompt: input,
                context
            })

            if (data.success) {
                setMessages(prev => [...prev, { role: 'system', content: data.response }])
            } else {
                toast.error("AI failed to respond")
            }

        } catch (error) {
            console.error(error)
            toast.error("Failed to reach AI")
            setMessages(prev => [...prev, { role: 'system', content: "I'm having trouble connecting to the server right now." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 group border border-white/20"
                    aria-label="Open AI Assistant"
                >
                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-surface text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-border pointer-events-none">
                        Ask AI
                    </span>
                </button>
            )}

            {/* Chat Window */}
            <div className={`fixed bottom-6 right-6 w-96 max-h-[600px] h-[500px] bg-surface/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col transition-all z-50 origin-bottom-right duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>

                {/* Header */}
                <div className='p-4 border-b border-border flex items-center justify-between bg-primary/5 rounded-t-2xl'>
                    <div className='flex items-center gap-2 text-primary font-bold font-outfit'>
                        <Sparkles size={18} />
                        <span>Antigravity AI</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label="Close Assistant" className='text-text-muted hover:text-text-main transition'>
                        <Minimize2 size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar'>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                            max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                            ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-text-main/5 text-text-main border border-border rounded-bl-none'}
                        `}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className='flex justify-start'>
                            <div className='bg-text-main/5 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center'>
                                <span className='w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce'></span>
                                <span className='w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-100'></span>
                                <span className='w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-200'></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className='p-3 border-t border-border bg-surface rounded-b-2xl'>
                    <div className='flex gap-2'>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about stats, SEO, or ideas..."
                            className='flex-1 bg-background border border-border rounded-xl px-4 py-2 text-text-main text-sm focus:border-primary outline-none transition'
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className='p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition'
                            aria-label="Send Message"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default AIAssistant
