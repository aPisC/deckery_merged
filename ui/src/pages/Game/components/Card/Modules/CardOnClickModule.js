import useCardEventSync from './useCardEventSync';

export default function CardOnClickModule({ onClick }) {
  useCardEventSync('onClick', onClick);
  return null;
}
