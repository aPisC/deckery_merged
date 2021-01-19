import React, {
  useRef,
  useState,
  FunctionComponent,
  MutableRefObject,
} from 'react';

export interface IPopupBackend {
  layerRef: MutableRefObject<HTMLDivElement | null>;
  isLayerOpen: boolean;
  openedPopup: (closeHandler: Function) => void;
  closedPopup: (closeHandler: Function) => void;
  closeAllPopup: Function;
  getDropData: () => any;
  setDropData: (data: any) => void;
}

export const PopupContext = React.createContext<IPopupBackend | null>(null);

const PopupBackend: FunctionComponent = ({ children }) => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const dropDataRef = useRef<any>(null);

  const [closeEvents, setCloseEvents] = useState<Function[]>([]);

  const obj: IPopupBackend = {
    layerRef,
    isLayerOpen: closeEvents.length > 0,
    openedPopup: (closeHandler) => setCloseEvents((h) => [...h, closeHandler]),
    closedPopup: (closeHandler) =>
      setCloseEvents((h) => h.filter((e) => e !== closeHandler)),
    closeAllPopup: () =>
      closeEvents.forEach((e) => {
        if (e) e();
      }),
    getDropData: () => dropDataRef.current,
    setDropData: (data) => (dropDataRef.current = data),
  };
  return <PopupContext.Provider value={obj}>{children}</PopupContext.Provider>;
};
export default PopupBackend;
