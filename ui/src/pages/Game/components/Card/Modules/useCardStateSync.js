import { useCallback, useContext, useEffect } from 'react';
import { CardContext } from '..';

export default function useCardStateSync(key, value, setState) {
  const card = useContext(CardContext);
  let _setState = useCallback(
    (key, value) => setState((state) => ({ ...state, [key]: value })),
    [setState]
  );
  if (!setState) _setState = card && card.setState;
  useEffect(() => {
    _setState(key, value);
  }, [key, value, _setState]);
}
