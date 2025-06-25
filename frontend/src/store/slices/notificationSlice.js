export const initialNotificationState = {
    toasts: [],
};
export const createNotificationSlice = set => ({
    ...initialNotificationState,
    addToast: toast => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        set(state => ({ toasts: [...state.toasts, newToast] }));
        return id;
    },
    removeToast: id => {
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    },
});
