import { useEffect } from 'react';

const useBodyEvent = (type, handler) => {
  useEffect(() => {
    window.document.body.addEventListener(type, handler);
    return () => {
      window.document.body.removeEventListener(type, handler);
    };
  }, [type, handler]);
};
export default useBodyEvent;
