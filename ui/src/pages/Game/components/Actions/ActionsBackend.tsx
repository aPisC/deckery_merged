import React, {
  ReactElement,
  ReactNode,
  useMemo,
  useContext,
  useRef,
} from 'react';
import { DispatchContext, StateContext } from '../../contexts';
import { AuthenticatedContenxt } from '../../../../core/authentication';
import safeEval from 'notevil';
import Initialize from './Initialize';

interface IActionsBackend {
  execute?: (code: any, actionId: any, env: any, contextEnv: any) => void;
}

export const ActionsContext = React.createContext<IActionsBackend>({});

interface Props {
  children: ReactNode;
}

export default function ActionsBackend({ children }: Props): ReactElement {
  const dispatch = useRef(null);
  dispatch.current = useContext(DispatchContext);
  const state = useRef(null);
  state.current = useContext(StateContext);
  const auth = useRef(null);
  auth.current = useContext(AuthenticatedContenxt);

  const backend = useMemo(() => {
    // Initialize Adder environment

    // Create execution function
    function execute(action: any, env: any = {}, contextEnv: any = {}) {
      const context = Initialize(
        contextEnv,
        () => state.current,
        () => auth.current,
        () => dispatch.current
      );
      return safeEval(action, { ...context, ...env });
    }

    return { execute };
    // eslint-disable-next-line
  }, []);

  return (
    <ActionsContext.Provider value={backend}>
      {children}
    </ActionsContext.Provider>
  );
}
