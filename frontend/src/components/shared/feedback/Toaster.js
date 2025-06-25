import { jsx as _jsx } from "react/jsx-runtime";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Toaster = () => {
    return (_jsx(ToastContainer, { closeOnClick: true, draggable: true, newestOnTop: true, pauseOnFocusLoss: true, pauseOnHover: true, autoClose: 5000, hideProgressBar: false, position: "top-right", rtl: false, theme: "light" }));
};
export const showSuccess = (message) => {
    toast.success(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};
export const showError = (message) => {
    toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};
export const showInfo = (message) => {
    toast.info(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};
export const showWarning = (message) => {
    toast.warning(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};
