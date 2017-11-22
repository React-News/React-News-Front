import { routerRedux } from 'dva/router';
import { login } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined
  },

  effects: {
    *submit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true
      });
      const response = yield call(login, payload);
      yield console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response
      });
      yield put({
        type: 'changeSubmitting',
        payload: false
      });
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false
        }
      });
      yield put(routerRedux.push('/user/login'));
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload
      };
    }
  }
};
