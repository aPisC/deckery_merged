import useCardEventSync from './useCardEventSync';

export default function CardOnDoubleClickModule({ onDoubleClick }) {
  useCardEventSync('onDoubleClick', onDoubleClick);
  return null;
}
