import { logger } from 'app/logging/logger';
import {
  appSocketInvocationStarted,
  socketInvocationStarted,
} from 'services/events/actions';

import { startAppListening } from '../..';

export const addInvocationStartedEventListener = () => {
  startAppListening({
    actionCreator: socketInvocationStarted,
    effect: (action, { dispatch }) => {
      const log = logger('socketio');

      log.debug(
        action.payload,
        `Invocation started (${action.payload.data.node.type})`
      );

      dispatch(appSocketInvocationStarted(action.payload));
    },
  });
};
