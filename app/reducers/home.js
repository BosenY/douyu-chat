// @flow
import { ADD_DANMU, DECREMENT_DANMU } from '../actions/home';
import type { Action } from './types';

export default function(state = [], action: Action) {
  switch (action.type) {
    case ADD_DANMU:
      return [...state, action.text];
    case DECREMENT_DANMU:
      return [...state.slice(1)];
    default:
      return state;
  }
}
