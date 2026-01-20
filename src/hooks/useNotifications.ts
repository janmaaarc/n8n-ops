import { useCallback, useEffect, useRef } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface UseNotificationsOptions {
  enabled?: boolean;
  onError?: boolean;
  onSuccess?: boolean;
}

interface UseNotificationsReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  notify: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

export const useNotifications = (
  options: UseNotificationsOptions = {}
): UseNotificationsReturn => {
  const { enabled = true } = options;
  const permissionRef = useRef<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'denied'
  );

  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      permissionRef.current = Notification.permission;
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      permissionRef.current = permission;
      return permission;
    } catch {
      return 'denied';
    }
  }, [isSupported]);

  const notify = useCallback(
    (title: string, notificationOptions?: NotificationOptions) => {
      if (!isSupported || !enabled || permissionRef.current !== 'granted') {
        return;
      }

      // Don't notify if the tab is focused
      if (document.hasFocus()) {
        return;
      }

      try {
        const notification = new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...notificationOptions,
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        // Focus the tab when clicked
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch {
        // Silently fail if notification creation fails
      }
    },
    [isSupported, enabled]
  );

  return {
    permission: permissionRef.current,
    requestPermission,
    notify,
    isSupported,
  };
};

// Storage key for notification settings
const NOTIFICATIONS_SETTINGS_KEY = 'n8n-dashboard-notifications';

interface NotificationSettings {
  enabled: boolean;
  onError: boolean;
  onSuccess: boolean;
}

const defaultSettings: NotificationSettings = {
  enabled: false,
  onError: true,
  onSuccess: false,
};

export const getNotificationSettings = (): NotificationSettings => {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultSettings;
};

export const saveNotificationSettings = (settings: NotificationSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
};
