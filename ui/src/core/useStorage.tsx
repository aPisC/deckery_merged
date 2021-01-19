import React, {
  ReactElement,
  ReactNode,
  useMemo,
  useContext,
  useState,
} from 'react';

type IStorage = {
  update: (key: any, value?: any) => void;
  retrieve: (key?: string) => any;
};

const StorageContext = React.createContext<IStorage>({
  update: () => {},
  retrieve: () => null,
});

interface Props {
  children: ReactNode;
}

function createBackend(): IStorage {
  const data: any = {};

  return {
    update: (key, value) => (data[key] = value),
    retrieve: (key) => data[key || ''],
  };
}

export function StorageBackend({ children }: Props): ReactElement {
  const backend = useMemo(createBackend, []);
  return (
    <StorageContext.Provider value={backend}>
      {children}
    </StorageContext.Provider>
  );
}

export default function useStorage(key: string | undefined) {
  const backend = useContext(StorageContext);
  if (key) {
    return [
      () => backend.retrieve(key),
      (value: any) => backend.update(key, value),
    ];
  }
  return [backend.retrieve, backend.update];
}

export function useStorageState(
  key: string | undefined,
  defaultValue: any = null
) {
  const [r, u] = useStorage(key);
  const [state, setState] = useState(r(null) || defaultValue);
  u(state);

  return [state, setState];
}
