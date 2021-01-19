import React, { useContext } from 'react';
import {
  AuthenticatedContenxt,
  AuthenticatorContext,
} from '../../core/authentication';
import { Link } from 'react-router-dom';

export default function UserButtons() {
  const auth = useContext(AuthenticatedContenxt);

  const auth2 = useContext(AuthenticatorContext);

  return (
    <>
      {!auth.user && (
        <Link className="btn btn-outline-primary" to="/login">
          Log in
        </Link>
      )}
      {auth.user && (
        <div className="btn btn-outline-primary" onClick={() => auth2.logout()}>
          Log out
        </div>
      )}
    </>
  );
}
