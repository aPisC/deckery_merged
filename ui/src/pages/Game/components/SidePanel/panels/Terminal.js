import React, { useContext, useState } from 'react';
import Editor from 'react-simple-code-editor';
import useLocalStorage from '../../../../../core/useLocalStorage';
import { ActionsContext } from '../../Actions/ActionsBackend';

const toString = (val, nested) => {
  if (typeof val === 'function') return 'function';
  if (typeof val === 'object' && !nested) {
    let str = 'Object {\n';
    for (const p in val) {
      // eslint-disable-next-line no-prototype-builtins
      if (val.hasOwnProperty(p))
        str += `    "${String(p)}": ${toString(val[p], true)}\n`;
      else str += `    ("${String(p)}"): ${toString(val[p], true)}\n`;
    }
    str += '}';
    return str;
  }
  return String(val);
};

export default function Terminal() {
  const [logs, setLogs] = useState('');
  const actions = useContext(ActionsContext);
  const [value, setValue] = useLocalStorage('actions-conssole-content', '');

  const log = (...p) => {
    console.log('ActionsConsole', ...p);
    const text = p.map((x) => toString(x)).join(', ');
    setLogs((logs) => `${logs + text}\n`);
  };

  return (
    <div>
      <div>
        <Editor
          value={value}
          onValueChange={(code) => {
            setValue(code);
          }}
          padding={10}
          highlight={(code) => code}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: '#eee',
            color: 'black',
            minHeight: '30vh',
          }}
        />
      </div>
      <div className={'text-right p-2'}>
        <button
          type="button"
          className={'btn bg-primary text-light '}
          onClick={() => {
            setLogs('');
            try {
              const val = actions.execute(value, { log });
              if (val != null) log('>>>>', val);
            } catch (ex) {
              log(ex.stack);
            }
          }}
        >
          Run
        </button>
      </div>
      <div>
        <h6>Output: </h6>
        <pre
          style={{
            padding: '8px',
            marginTop: '16px',
            fontSize: 14,
            color: 'var(--color-opposite)',
          }}
        >
          <code>{logs}</code>
        </pre>
      </div>
    </div>
  );
}
