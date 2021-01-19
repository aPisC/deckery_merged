import React, { useContext } from 'react';
import useSocketIo from '../core/useSocketIo';
import { AuthenticatedContenxt } from '../core/authentication';
import { useParams } from 'react-router';

export default function SocketTest() {
  const auth = useContext(AuthenticatedContenxt);
  const { gameId } = useParams();
  // connect to socket.io
  const socket = useSocketIo(
    'https://dev0-srv.apisc.host/game',
    (event, ...p) => {
      const fn = {
        connect: (...p) => {
          console.log('connected');
        },
        m1: (...p) => {
          console.log('got m1', p);
          socket.emit('hello', 'world');
        },
        m2: (...p) => {
          console.log('got m2', p);
        },
        initialize: (data) => {
          console.log(data);
        },
      }[event];
      if (fn) fn(...p);
      console.log('>>>', event, p);
    },
    { query: { token: auth.jwt, gameId: gameId } }
  );

  return <div></div>;
}
