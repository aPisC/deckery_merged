import { useContext, useMemo } from 'react';

export default function useSelector(selector, ...params) {
  // Load required contexts
  const ctxParams = [];
  const contexts = selector.contexts ? selector.contexts : [];
  for (let i = 0; i < contexts.length; i++) {
    // eslint-disable-next-line
    ctxParams.push(useContext(contexts[i]));
  }

  // Collect selector parameters
  const finalParams = [...ctxParams, ...params];

  // Memorize value
  const value = useMemo(
    () => selector(...finalParams),
    // eslint-disable-next-line
    selector.deps ? selector.deps(...finalParams) : finalParams
  );

  // Return selector value
  return value;
}
