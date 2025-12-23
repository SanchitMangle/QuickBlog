import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel", isDanger = true }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-surface border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden"
                >
                    {/* Background Bloom */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-red-500/10 blur-[50px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                            <AlertTriangle size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">{title}</h3>
                        <p className="text-text-muted mb-8 leading-relaxed max-w-xs">{message}</p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-text-main font-medium transition-colors border border-white/5"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${isDanger ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25' : 'bg-primary hover:bg-primary/90 shadow-primary/25'}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default ConfirmationModal
