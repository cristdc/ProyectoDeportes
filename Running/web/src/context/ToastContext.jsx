import { createContext, useContext } from 'react';
import { toast, Toaster } from 'sonner';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const showSuccessToast = (message) => {
        toast.success(message);
    };

    const showErrorToast = (message) => {
        toast.error(message);
    };

    const showInfoToast = (message) => {
        toast.info(message);
    };

    const value = {
        showSuccessToast,
        showErrorToast,
        showInfoToast,
    };

    return (
        <ToastContext.Provider value={value}>
            <Toaster position="top-right" richColors />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};