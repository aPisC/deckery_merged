import { useContext, useEffect } from 'react';
import { CardContext } from '..';

export default function useCardEventSync(key, value) {
  const card = useContext(CardContext);
  const setState = card && card.setEvent;
  useEffect(() => {
    const evtBefore = card.events[key];
    setState(key, value);
    return () => setState(key, evtBefore);
    // eslint-disable-next-line
  }, [key, value, setState]);
}
