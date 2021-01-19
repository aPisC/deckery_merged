import React, { useReducer, useCallback, useRef, useContext } from 'react';
import { reducer } from '../store/reducers';
import initialState from '../store/initialState';
import socketHandler from '../store/socketHandlers';
import { AuthenticatedContenxt } from '../../../core/authentication';
import { useParams } from 'react-router';
import { BackendUrl } from '../../../constants';
import useSocketIo from '../../../core/useSocketIo';
import { DispatchContext, StateContext, StateGetterContext } from '../contexts';

export default function SocketReducerBackend({ children }) {
  // Game parameters
  const auth = useContext(AuthenticatedContenxt);
  const { gameId } = useParams();

  // References to socket and dispatch function
  const dispatchRef = useRef(null);
  const socketRef = useRef(null);
  const stateRef = useRef(null);

  // Reducer that redirects actions with dispatch and emit functions attached
  const dispatcher = useCallback(
    (state, action) => {
      return reducer({
        state,
        action,
        auth,
        dispatch: (...p) => dispatchRef.current(...p),
        emit: (...p) => {
          console.debug('Socket send', ...p);
          socketRef.current.emit(...p);
        },
      });
    },
    [dispatchRef, socketRef, auth]
  );

  // Create reducer and update references
  const [globalState, dispatch] = useReducer(dispatcher, initialState);

  /* useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);*/

  // Create socket and update references
  const socket = useSocketIo(
    `${BackendUrl}/game`,
    function (event, ...p) {
      socketHandler.call(this, {
        event,
        params: p,
        emit: (...p) => socketRef.current.emit(...p),
        dispatch: (...p) => dispatchRef.current(...p),
        state: globalState,
      });
    },
    { query: { token: auth.jwt, gameId: gameId } }
  );
  /* useEffect(() => {
    socketRef.current = socket;
  }, [socket]);*/

  socketRef.current = socket;
  dispatchRef.current = dispatch;
  stateRef.current = globalState;

  const dispatch2 = (action) => dispatch(action);

  return (
    <DispatchContext.Provider value={dispatch2}>
      <StateContext.Provider value={globalState}>
        <StateGetterContext.Provider
          value={useCallback(() => stateRef.current, [stateRef])}
        >
          {children}
        </StateGetterContext.Provider>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}
