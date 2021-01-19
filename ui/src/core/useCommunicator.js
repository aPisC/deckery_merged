import { useCallback, useContext, useMemo } from 'react';
import Axios from 'axios';
import { BackendUrl } from '../constants';
import { AuthenticatedContenxt } from './authentication';

const useCommunicator = () => {
  const auth = useContext(AuthenticatedContenxt);

  const send = useCallback(
    ({ url, method, data, headers }) => {
      return Axios({
        method,
        url: BackendUrl + url,
        data,
        headers: {
          ...(auth.jwt ? { Authorization: `Bearer ${auth.jwt}` } : {}),
          ...headers,
        },
      });
    },
    [auth]
  );

  const communicator = useMemo(
    () => ({
      send,
      get: (url, data) => send({ url, data, method: 'GET' }),
      post: (url, data) => send({ url, data, method: 'POST' }),
      put: (url, data) => send({ url, data, method: 'PUT' }),
      delete: (url, data) => send({ url, data, method: 'DELETE' }),
    }),
    [send]
  );
  return communicator;
};

export default useCommunicator;
