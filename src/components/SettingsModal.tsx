import React, { useState, useEffect } from 'react';
import { X, Server, Key, Clock, RotateCw, CheckCircle, XCircle, Loader2, Bell } from 'lucide-react';
import { n8nApi } from '../services/n8n';
import type { Settings } from '../hooks/useSettings';
import { getNotificationSettings, saveNotificationSettings, useNotifications } from '../hooks/useNotifications';
import { useCredentials } from '../hooks/useCredentials';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Partial<Settings>) => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<Settings>(settings);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [notificationSettings, setNotificationSettings] = useState(getNotificationSettings);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { permission, requestPermission, isSupported } = useNotifications();
  const { isAuthenticated } = useAuth();
  const { credentials, saveCredentials, loading: credentialsLoading } = useCredentials();

  const useSupabaseCredentials = isSupabaseConfigured() && isAuthenticated;

  useEffect(() => {
    if (useSupabaseCredentials && credentials) {
      setFormData((prev) => ({
        ...prev,
        n8nUrl: credentials.n8nUrl || prev.n8nUrl,
        apiKey: credentials.hasApiKey ? '••••••••' : '',
      }));
    } else {
      setFormData(settings);
    }
    setConnectionStatus('idle');
    setNotificationSettings(getNotificationSettings());
    setSaveError(null);
  }, [settings, isOpen, credentials, useSupabaseCredentials]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      if (useSupabaseCredentials) {
        // For multi-user mode, save credentials to Supabase
        // Only save if API key was changed (not the placeholder)
        if (formData.apiKey && formData.apiKey !== '••••••••') {
          const success = await saveCredentials(formData.n8nUrl, formData.apiKey);
          if (!success) {
            setSaveError('Failed to save credentials');
            return;
          }
        } else if (formData.n8nUrl !== credentials?.n8nUrl) {
          // URL changed but API key wasn't - need to re-enter API key
          setSaveError('Please enter your API key to save changes');
          return;
        }
        // Save local preferences (auto-refresh, interval)
        onSave({ refreshInterval: formData.refreshInterval, autoRefresh: formData.autoRefresh });
      } else {
        // For single-user mode, save to localStorage
        onSave(formData);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const handleChange = (field: keyof Settings, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setConnectionStatus('idle');
  };

  const handleNotificationChange = async (field: 'enabled' | 'onError' | 'onSuccess', value: boolean) => {
    // If enabling notifications, request permission first
    if (field === 'enabled' && value && permission !== 'granted') {
      const result = await requestPermission();
      if (result !== 'granted') {
        return; // Don't enable if permission was denied
      }
    }

    const newSettings = { ...notificationSettings, [field]: value };
    setNotificationSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    // Temporarily save settings to test
    onSave(formData);

    // Small delay to ensure settings are saved
    await new Promise((resolve) => setTimeout(resolve, 100));

    const success = await n8nApi.testConnection();
    setConnectionStatus(success ? 'success' : 'error');
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5">
          {/* Connection Section */}
          <div>
            <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
              Connection
            </h3>
            <div className="space-y-3">
              {/* n8n URL */}
              <div>
                <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 mb-1.5">
                  <Server size={14} className="text-neutral-400" />
                  n8n Instance URL
                </label>
                <input
                  type="url"
                  value={formData.n8nUrl}
                  onChange={(e) => handleChange('n8nUrl', e.target.value)}
                  placeholder="https://your-n8n.example.com"
                  className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 mb-1.5">
                  <Key size={14} className="text-neutral-400" />
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  onFocus={() => {
                    if (formData.apiKey === '••••••••') {
                      setFormData((prev) => ({ ...prev, apiKey: '' }));
                    }
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  placeholder={useSupabaseCredentials && credentials?.hasApiKey ? 'Enter new API key to update' : 'Your n8n API key'}
                  className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                />
                {useSupabaseCredentials && credentials?.hasApiKey && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    API key is securely stored. Enter a new key only to update it.
                  </p>
                )}
              </div>

              {/* Test Connection */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'testing'}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {connectionStatus === 'testing' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : connectionStatus === 'success' ? (
                    <CheckCircle size={14} className="text-emerald-500" />
                  ) : connectionStatus === 'error' ? (
                    <XCircle size={14} className="text-red-500" />
                  ) : (
                    <Server size={14} className="text-neutral-400" />
                  )}
                  Test Connection
                </button>
                {connectionStatus === 'success' && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-500">Connected!</span>
                )}
                {connectionStatus === 'error' && (
                  <span className="text-xs text-red-600 dark:text-red-500">Connection failed</span>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
              Preferences
            </h3>
            <div className="space-y-3">
              {/* Auto Refresh */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <RotateCw size={14} className="text-neutral-400" />
                  Auto-refresh data
                </label>
                <button
                  type="button"
                  onClick={() => handleChange('autoRefresh', !formData.autoRefresh)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    formData.autoRefresh
                      ? 'bg-indigo-500'
                      : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      formData.autoRefresh ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Refresh Interval */}
              {formData.autoRefresh && (
                <div>
                  <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 mb-1.5">
                    <Clock size={14} className="text-neutral-400" />
                    Refresh interval (seconds)
                  </label>
                  <select
                    value={formData.refreshInterval}
                    onChange={(e) => handleChange('refreshInterval', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value={10}>10 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Section */}
          {isSupported && (
            <div>
              <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                Notifications
              </h3>
              <div className="space-y-3">
                {/* Enable Notifications */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Bell size={14} className="text-neutral-400" />
                    Enable browser notifications
                  </label>
                  <button
                    type="button"
                    onClick={() => handleNotificationChange('enabled', !notificationSettings.enabled)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      notificationSettings.enabled
                        ? 'bg-indigo-500'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        notificationSettings.enabled ? 'left-5' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {permission === 'denied' && (
                  <p className="text-xs text-amber-600 dark:text-amber-500">
                    Notifications are blocked. Enable them in your browser settings.
                  </p>
                )}

                {/* Notification Types */}
                {notificationSettings.enabled && (
                  <div className="pl-6 space-y-3 border-l-2 border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        On execution errors
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('onError', !notificationSettings.onError)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          notificationSettings.onError
                            ? 'bg-indigo-500'
                            : 'bg-neutral-200 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            notificationSettings.onError ? 'left-5' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        On execution success
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('onSuccess', !notificationSettings.onSuccess)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          notificationSettings.onSuccess
                            ? 'bg-indigo-500'
                            : 'bg-neutral-200 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            notificationSettings.onSuccess ? 'left-5' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 border-t border-red-200 dark:border-red-500/20">
            <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || credentialsLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
