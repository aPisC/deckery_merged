import { useContext } from 'react';
import { CardContext } from '..';
import useSelector from '../../../../../core/useSelector';
import { DispatchContext } from '../../../contexts';
import { setCardSelectedAction } from '../../../store/actions/card';
import { isCardSelectedSelector } from '../../../store/selectors/card';
import useCardEventSync from './useCardEventSync';
import useCardStateSync from './useCardStateSync';

export default function CardSelectableModule() {
  const dispatch = useContext(DispatchContext);
  const { card } = useContext(CardContext);

  const selected = !!useSelector(isCardSelectedSelector, card);

  const setSelection = (_selected) => {
    if (typeof _selected === 'function') _selected = _selected(selected);
    dispatch(setCardSelectedAction(card, _selected));
  };
  useCardStateSync('selected', !!selected);
  useCardEventSync('setIsSelected', setSelection);

  return null;
}
