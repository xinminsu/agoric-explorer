/* eslint-disable no-underscore-dangle */
/* eslint-disable react/display-name */
export { makeReactAgoricQueryConnection } from '@agoric/query-components/react.js';
import React, { useState, useEffect } from 'react';
import { E } from '@endo/eventual-send';
import { observeIterator } from '@agoric/notifier';
import { makeStyles } from '@mui/styles';

import { withApplicationContext } from '../contexts/Application.jsx';
import { makeBackendFromQueryBridge } from '../util/QueryBackendAdapter.js';
import { makeFixedWebSocketConnector } from '../util/query-fixed-websocket-connector.js';

const useStyles = makeStyles(_ => ({
  hidden: {
    display: 'none',
  },
}));

// Create a wrapper for agoric-query-connection that is specific to
// the app's instance of React.
const AgoricQueryConnection = makeReactAgoricQueryConnection(React);

const QueryConnection = ({
  setBackend,
  setConnectionState,
  disconnect,
  connectionConfig,
}) => {
  const classes = useStyles();
  const [qc, setQC] = useState(null);

  let cancelled = null;
  const onQueryState = ev => {
    if (cancelled) {
      return;
    }
    const { queryConnection: newQC, state } = ev.detail;
    setConnectionState(state);
    if (!qc) {
      setQC(newQC);
    }
  };

  useEffect(() => {
    if (!qc) {
      return () => {};
    }
    const bridge = E(qc).getAdminBootstrap(
      connectionConfig.accessToken,
      makeFixedWebSocketConnector(connectionConfig.href),
    );

    const { backendIt, cancel } = makeBackendFromQueryBridge(bridge);
    const rethrowIfNotCancelled = e => {
      if (!cancelled) {
        throw e;
      }
    };

    observeIterator(backendIt, {
      updateState: be => {
        if (cancelled) {
          throw Error('cancelled');
        }
        setBackend(be);
      },
    }).catch(rethrowIfNotCancelled);

    return () => {
      cancelled = true;
      disconnect();
      cancel();
    };
  }, [qc]);

  return (
    <AgoricQueryConnection
      onState={onQueryState}
      className={classes.hidden}
    />
  );
};

export default withApplicationContext(QueryConnection, context => ({
  setConnectionState: context.setConnectionState,
  disconnect: context.disconnect,
  setBackend: context.setBackend,
  connectionConfig: context.connectionConfig,
}));
