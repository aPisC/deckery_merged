import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthenticatedContenxt } from '../../core/authentication';
import UserButtons from './UserButtons';

export default function Layout({ children }) {
  const { user } = useContext(AuthenticatedContenxt);
  return (
    <>
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <h5 className="my-0 mr-md-auto font-weight-normal">Deckery</h5>
        <nav className="my-2 my-md-0 mr-md-3">
          {user && (
            <Link className="btn bg-primary text-white mr-2" to="/games">
              My Games
            </Link>
          )}
          <UserButtons />
        </nav>
      </div>
      {children}
    </>
  );
}
