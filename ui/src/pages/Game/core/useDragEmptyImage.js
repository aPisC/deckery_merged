import { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';

export default function useDragEmptyImage(preview) {
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
    // eslint-disable-next-line
  }, []);
}
