import { useState, useEffect, useCallback } from 'react';

export interface Settings {
  n8nUrl: string;
  apiKey: string;
  refreshInterval: number;
  autoRefresh: boolean;
}

const STORAGE_KEY = 'n8n-dashboard-settings';

const defaultSettings: Settings = {
  n8nUrl: '',
  apiKey: '',
  refreshInterval: 30,
  autoRefresh: true,
};

const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultSettings;
};

const saveSettings = (settings: Settings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const useSettings = () => {
  const [settings, setSettingsState] = useState<Settings>(loadSettings);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    const loaded = loadSettings();
    setSettingsState(loaded);
    setIsConfigured(Boolean(loaded.n8nUrl && loaded.apiKey));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      setIsConfigured(Boolean(updated.n8nUrl && updated.apiKey));
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettingsState(defaultSettings);
    setIsConfigured(false);
  }, []);

  return {
    settings,
    isConfigured,
    updateSettings,
    resetSettings,
  };
};

export const getStoredSettings = (): Settings => loadSettings();
