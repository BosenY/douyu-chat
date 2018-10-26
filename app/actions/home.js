// @flow
// import type { GetState, Dispatch } from '../reducers/types';

export const ADD_DANMU = 'ADD_DANMU';
export const DECREMENT_DANMU = 'DECREMENT_DANMU';

export function ADD(text) {
  return {
    type: ADD_DANMU,
    text
  };
}

export function DECREMENT() {
  return {
    type: DECREMENT_DANMU
  };
}
