import React, { useMemo, useEffect, useContext } from 'react';

const AnimationFrameContext = React.createContext();

const AnimationFrameBackend = ({ children }) => {
  // Create backend for animation frame handlers
  const backend = useMemo(() => {
    const handlers = [];
    const addHandler = (handler) => {
      handlers.push(handler);
    };
    const removeHandler = (handler) => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
    const getHandlers = () => handlers;
    return {
      addHandler,
      removeHandler,
      getHandlers,
    };
  }, []);

  // Start animation frame requesting
  useEffect(() => {
    let isRunning = true;
    let lastTs = null;
    const handler = (time) => {
      if (!isRunning) return;
      if (!lastTs) lastTs = time;
      else {
        const elapsed = time - lastTs;
        lastTs = time;
        backend.getHandlers().forEach((h) => h(elapsed));
      }
      requestAnimationFrame(handler);
    };
    requestAnimationFrame(handler);
    return () => (isRunning = false);
    // eslint-disable-next-line
  }, []);

  return (
    <AnimationFrameContext.Provider value={backend}>
      {children}
    </AnimationFrameContext.Provider>
  );
};

const useAnimationFrame = (handler) => {
  // Connect to backend
  const backend = useContext(AnimationFrameContext);

  // register handlers
  useEffect(() => {
    backend.addHandler(handler);
    return () => backend.removeHandler(handler);
  }, [handler, backend]);
};

export { AnimationFrameBackend };
export default useAnimationFrame;
