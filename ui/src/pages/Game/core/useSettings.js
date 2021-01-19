import React, { useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../../../core/useLocalStorage';

export const SettingsContext = React.createContext();

export const SettingsBackend = function ({
  identifier = 'settings',
  children,
  initialSettings,
}) {
  const [settings, updateSettings] = useLocalStorage(
    identifier,
    initialSettings
  );

  return (
    <SettingsContext.Provider value={[settings, updateSettings]}>
      {children}
    </SettingsContext.Provider>
  );
};

const selector = (select, from) => {
  select.split('.').forEach((s) => {
    if (from != null && typeof from === 'object') from = from[s];
    else from = null;
  });
  return from;
};

const updater = (key, value, data) => {
  const ss = key.split('.');
  const r = { ...data };
  let d2 = r;
  ss.forEach((s, i) => {
    if (i < ss.length - 1) {
      const d3 = d2[s] && typeof d2[s] === 'object' ? { ...d2[s] } : {};
      d2[s] = d3;
      d2 = d3;
    } else {
      d2[s] = value;
    }
  });
  return r;
};

const useSettings = (select, defaultValue = null) => {
  const [settings, updateSettings] = useContext(SettingsContext);
  const value = useMemo(() => {
    if (Array.isArray(select))
      return select.forEach((s) => selector(s, settings));
    return selector(select, settings);
  }, [select, settings]);

  const update = useCallback(
    (val) => {
      if (Array.isArray(select))
        updateSettings((settings) =>
          select.reduce((ns, key, i) => updater(key, val[i], ns), settings)
        );
      updateSettings((settings) => updater(select, val, settings));
    },
    [updateSettings, select]
  );

  return [value == null ? defaultValue : value, update];
};
export default useSettings;
