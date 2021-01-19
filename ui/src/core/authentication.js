import React, { useContext, useEffect, useMemo } from 'react';
import Axios from 'axios';
import { BackendUrl } from '../constants';
import useLocalStorage from './useLocalStorage';
import { useLocation, useHistory } from 'react-router-dom';

export const AuthenticatedContenxt = React.createContext();
export const AuthenticatorContext = React.createContext();

/**
 * Creates the authenticator object for the given user state.
 * @param {Object} authState Current user state
 * @param {Function} setAuthState Setter function for user state
 * @returns {Object} Authenticator object with functions login, logout and register
 */
const createAuthenticatorObject = (authState, setAuthState) => {
  const login = (username, password) =>
    Axios.post(`${BackendUrl}/auth/local/`, {
      identifier: username,
      password: password,
    })
      .then((d) => {
        setAuthState({ ...authState, user: d.data.user, jwt: d.data.jwt });
        return d;
      })
      .catch((e) => {
        setAuthState({ ...authState, user: null, jwt: null });
        throw e;
      });

  const logout = () => {
    setAuthState({ ...authState, user: null, jwt: null });
  };

  const loginOauth = (id) => {
    return Axios({
      method: 'GET',
      url: `${BackendUrl}/auth/google/callback?${id}`,
    }).then((d) => {
      setAuthState({ ...authState, user: d.data.user, jwt: d.data.jwt });
      return d;
    });
  };
  const loginWithProvider = (provider) => {
    window.location = `${BackendUrl}/connect/${provider}/`;
  };

  const register = (username, password) => {};

  return { login, logout, register, loginOauth, loginWithProvider };
};

/**
 * Authentication react environment
 */
export const AuthenticationEnvironment = (props) => {
  const [authState, setAuthState] = useLocalStorage('auth', {
    user: null,
    jwt: null,
  });

  const authenticator = useMemo(
    () => createAuthenticatorObject(authState, setAuthState),
    [authState, setAuthState]
  );

  /** *
   * Logout after token expired
   */
  useEffect(() => {
    if (authState.jwt) {
      const d = JSON.parse(atob(authState.jwt.split('.')[1]));
      if (d.exp >= +new Date()) authenticator.logout();
    }
  }, [authenticator, authState]);

  return (
    <AuthenticatorContext.Provider value={authenticator}>
      <AuthenticatedContenxt.Provider value={authState}>
        {props.children}
      </AuthenticatedContenxt.Provider>
    </AuthenticatorContext.Provider>
  );
};

export function OAuthLanding() {
  const auth = useContext(AuthenticatorContext);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (!location) return;
    const { search } = location;
    if (!search) return;
    auth.loginOauth(search).then((x) => history.push('/'));
  }, [location, auth, history]);

  return null;
}
