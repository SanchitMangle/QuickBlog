import { createContext, useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [input, setInput] = useState("")

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all')
            data.success ? setBlogs(data.blogs) : toast.error(data.message)
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const loadUser = async () => {
        if (!token) return
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            const { data } = await axios.get('/api/auth/me')
            if (data.success) {
                setUser(data.user)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            logout()
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        navigate('/')
    }

    useEffect(() => {
        fetchBlogs()
        if (token) {
            loadUser()
        }
    }, [token])

    const value = {
        axios, navigate, blogs, setBlogs, token, setToken, user, setUser, input, setInput, logout
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}