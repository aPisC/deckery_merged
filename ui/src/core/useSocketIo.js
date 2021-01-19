import IO from 'socket.io-client';
import { useRef, useEffect, useState } from 'react';

const manualRedirectedEvents = [
  'disconnect',
  'error',
  'reconnect',
  'connect_timeout',
  'reconnect',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed',
];

export default function useSocketIo(url, eventHandler, initialOptions, init) {
  const eventhRef = useRef(eventHandler);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = new IO(url, initialOptions);
    if (init) init(socket);

    socket.on('connect', (...p) => {
      // Catch all event
      const oldOnevent = socket.onevent;
      socket.onevent = function (packet) {
        if (packet.data) {
          eventhRef.current.apply(socket, packet.data);
        }
        oldOnevent.apply(socket, arguments);
      };

      // Redirect connect event
      eventhRef.current.call(socket, 'connect', ...p);
    });

    manualRedirectedEvents.forEach((event) =>
      socket.on(event, (...p) => eventhRef.current.call(socket, event, ...p))
    );

    setSocket(socket);

    return () => {
      socket.close();
    };
    // eslint-disable-next-line
  }, [url]);

  useEffect(() => {
    eventhRef.current = eventHandler;
  }, [eventHandler]);
  return socket;
}
