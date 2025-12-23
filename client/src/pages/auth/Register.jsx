import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { assets } from '../../assets/assets';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
    const { setToken, navigate, axios } = useAppContext();
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                toast.success('Registered successfully');
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-surface/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl w-full max-w-md m-4"
            >
                <div className="text-center mb-8">
                    {theme === 'dark' ? (
                        <img src={assets.logo_light} alt="Logo" className="h-10 mx-auto mb-4 scale-100" />
                    ) : (
                        <img src={assets.logo} alt="Logo" className="h-10 mx-auto mb-4 scale-100" />
                    )}
                    <h2 className="text-3xl font-bold text-text-main mb-2">Create Account</h2>
                    <p className="text-text-muted">Join the community of creators today</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-text-main outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-text-main outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-text-main outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                    >
                        Get Started <ArrowRight size={18} />
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-text-muted text-sm">
                    Already have an account? <span className="text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors" onClick={() => navigate('/login')}>Sign In</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
