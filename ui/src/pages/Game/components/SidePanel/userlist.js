import React, { useContext, useMemo } from 'react';
import { StateContext } from '../../contexts';

function UserList(props) {
  const state = useContext(StateContext);

  return useMemo(() => {
    console.log('playerListRendered');
    return (
      <div>
        {state.players && state.players.map((x) => <span>{x.name}</span>)}
      </div>
    );
  }, [state.players]);
}

export default UserList;
