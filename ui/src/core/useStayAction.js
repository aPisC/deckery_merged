import { useEffect, useState, useRef } from 'react';
import useAnimationFrame from './useAnimationFrame';

export default function useStayAction(isOver, duration, action) {
  const [percentage, setPercentage] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const actionRef = useRef(action);
  actionRef.current = action;

  useAnimationFrame(() => {
    if (startTime)
      setPercentage(() => ((+new Date() - startTime) / duration) * 100);
    else if (percentage !== 0) setPercentage(0);
  });

  useEffect(() => {
    if (isOver) {
      const timeOut = setTimeout(() => {
        setStartTime(null);
        actionRef.current();
      }, duration);
      setStartTime(+new Date());

      return () => {
        clearTimeout(timeOut);
        setStartTime(null);
      };
    }
  }, [isOver, duration, actionRef]);

  return percentage;
}
