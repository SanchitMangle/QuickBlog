import React, { createContext, useContext, useState, useRef } from 'react';
import ConfirmationModal from '../components/common/ConfirmationModal';

const ConfirmationContext = createContext();

export const useConfirmation = () => useContext(ConfirmationContext);

export const ConfirmationProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isDanger: true
    });

    const resolver = useRef(null);

    const checkAction = async ({ title, message, confirmText = "Delete", cancelText = "Cancel", isDanger = true }) => {
        setModalState({
            isOpen: true,
            title,
            message,
            confirmText,
            cancelText,
            isDanger
        });

        return new Promise((resolve) => {
            resolver.current = resolve;
        });
    };

    const handleConfirm = () => {
        if (resolver.current) {
            resolver.current(true);
        }
        closeModal();
    };

    const handleCancel = () => {
        if (resolver.current) {
            resolver.current(false);
        }
        closeModal();
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        resolver.current = null;
    };

    return (
        <ConfirmationContext.Provider value={{ checkAction }}>
            {children}
            {modalState.isOpen && (
                <ConfirmationModal
                    isOpen={modalState.isOpen}
                    title={modalState.title}
                    message={modalState.message}
                    confirmText={modalState.confirmText}
                    cancelText={modalState.cancelText}
                    isDanger={modalState.isDanger}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmationContext.Provider>
    );
};
