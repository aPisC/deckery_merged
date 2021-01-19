import React, { useRef, useState } from 'react';
import { joystick, joystickInner } from './Joystick.module.scss';
import image from './joystick.png';
import useBodyEvent from '../../../../core/useBodyEvent';
import useAnimationFrame from '../../../../core/useAnimationFrame';
import clamp from '../../../../core/clamp';

const origStyle = {
  backgroundImage: `url(${image})`,
};

export default function Joystick({ onMove, style }) {
  // Reference for joystick dom
  const ref = useRef();

  // Position of joystick inner
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Tracking mouse position
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const moveHandler = (event) => {
    if (event.buttons !== 1) mouseDownRef.current = false;
    mousePositionRef.current = {
      x: event.pageX,
      y: event.pageY,
      button: event.buttons,
    };
  };
  useBodyEvent('mousemove', moveHandler);
  useBodyEvent('pointermove', moveHandler);

  // Trancink mouse button state
  const mouseDownRef = useRef(false);
  useBodyEvent('mouseup', (event) => (mouseDownRef.current = false));
  useBodyEvent('pointerup', (event) => (mouseDownRef.current = false));

  // Trancing if mouse is over screen
  const mouseOutRef = useRef(false);
  useBodyEvent('mouseenter', (event) => (mouseOutRef.current = false));
  useBodyEvent('mouseleave', (event) => (mouseOutRef.current = true));
  useBodyEvent('pointerenter', (event) => (mouseOutRef.current = false));
  useBodyEvent('pointerleave', (event) => (mouseOutRef.current = true));

  // Joystick update logic
  useAnimationFrame((time = 0) => {
    if (mouseDownRef.current && !mouseOutRef.current) {
      // Area of joystick dom
      const rect = ref.current.getBoundingClientRect();

      // Center position of joystick
      const center = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };

      // Difference from joystick center
      const diff = {
        x: mousePositionRef.current.x - center.x,
        y: mousePositionRef.current.y - center.y,
      };

      // Differences in the range of [-100, 100] clamped and relative to dom size
      const clamped = {
        x: clamp((200 * diff.x) / rect.width, -100, 100),
        y: clamp((200 * diff.y) / rect.height, -100, 100),
      };

      // Normalize difference if it would be out of the circle
      const mag =
        Math.sqrt(clamped.x * clamped.x + clamped.y * clamped.y) / 100;
      let vec = clamped;
      if (mag > 1)
        vec = {
          x: clamped.x / mag,
          y: clamped.y / mag,
        };

      // correcting with elapsed time for smooth movement
      const tcorr = {
        x: (vec.x * time) / 16,
        y: (vec.y * time) / 16,
      };

      // Update joystick inner position
      setPos(vec);
      // call move event
      if (onMove) onMove(tcorr);
    } else if (pos.x !== 0 || pos.y !== 0) {
      // set the joystick inner to the center if it is not used
      setPos({ x: 0, y: 0 });
    }
  });

  const mouseDown = () => {
    mouseDownRef.current = true;
  };

  return (
    <>
      <div
        className={joystick}
        style={{ ...origStyle, ...style }}
        ref={ref}
        onMouseDown={mouseDown}
        onPointerDown={mouseDown}
      >
        <JoystickInner {...pos} />
      </div>
    </>
  );
}

const JoystickInner = ({ x, y }) => {
  const innerStyle = {
    top: `${(y + 100) / 2}%`,
    left: `${(x + 100) / 2}%`,
  };
  const ignoredEvent = (event) => {
    event.preventDefault();
    return false;
  };
  return (
    <div
      className={joystickInner}
      style={innerStyle}
      onMouseDown={ignoredEvent}
      onMouseMove={ignoredEvent}
      onPointerDown={ignoredEvent}
      onPointerMove={ignoredEvent}
      onDragStart={ignoredEvent}
      onDrag={ignoredEvent}
    ></div>
  );
};
