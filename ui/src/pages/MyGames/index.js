import React, { useEffect, useState } from 'react';
import useCommunicator from '../../core/useCommunicator';
import Layout from '../../sharedComponents/Layout';
import { Link } from 'react-router-dom';
import NewGameModal from './NewGameModal';

export default function MyGames() {
  const comm = useCommunicator();
  const [state, setState] = useState({ error: null, loading: false, data: [] });

  useEffect(() => {
    setState((state) => ({ ...state, loading: true }));
    (async () => {
      const games = await comm.get('/games/available');
      setState((state) => ({ ...state, loading: false, data: games.data }));
      console.log(games);
    })();
  }, [comm]);

  const [isNewGameOpen, setNewGameOpen] = useState(false);

  return (
    <Layout>
      {isNewGameOpen && (
        <NewGameModal
          onClose={() => setNewGameOpen(false)}
          onCreated={(d) => {
            setState((s) => ({ ...s, data: [...s.data, d] }));
            setNewGameOpen(false);
          }}
        />
      )}
      <div className="container bg-white my-4 p-4">
        <h1>My Games</h1>
        <div className="w-100 mt-4">
          <div className="btn btn-primary" onClick={() => setNewGameOpen(true)}>
            New Game
          </div>
        </div>
        <table className="table table-striped mt-2">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((game) => (
              <tr key={game.id}>
                <th scope="row">{game.id}</th>
                <td>{game.name}</td>
                <td>{game.ownerName}</td>
                <td>{game.status}</td>
                <td>
                  <Link className="btn btn-primary" to={`/game/${game.id}`}>
                    Play
                  </Link>
                  <div
                    className="btn btn-danger"
                    onClick={() => {
                      comm.delete(`/games/${game.id}`).then(() =>
                        setState((state) => ({
                          ...state,
                          data:
                            state.data && state.data.filter((x) => x !== game),
                        }))
                      );
                    }}
                  >
                    Delete
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
