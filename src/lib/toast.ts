import { toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (message: string) =>
    hotToast.success(message, {
      duration: 4000,
      position: 'bottom-right',
    }),

  error: (message: string) =>
    hotToast.error(message, {
      duration: 4000,
      position: 'bottom-right',
    }),

  loading: (message: string) =>
    hotToast.loading(message, {
      position: 'bottom-right',
    }),

  dismiss: () => hotToast.dismiss(),
};
