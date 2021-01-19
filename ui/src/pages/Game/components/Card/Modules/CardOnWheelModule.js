import useCardEventSync from './useCardEventSync';

export default function CardOnWheelModule({ onWheel }) {
  useCardEventSync('onWheel', onWheel);
  return null;
}
