import { StateCreator } from 'zustand';
import { ToastNotification } from '../../../../shared/formatters';
import { AppStore } from '../../stores/useAppStore';
export interface NotificationSlice {
    toasts: ToastNotification[];
    addToast: (toast: Omit<ToastNotification, 'id'>) => string;
    removeToast: (id: string) => void;
}
export declare const initialNotificationState: Pick<NotificationSlice, 'toasts'>;
export declare const createNotificationSlice: StateCreator<AppStore, [], [], NotificationSlice>;
