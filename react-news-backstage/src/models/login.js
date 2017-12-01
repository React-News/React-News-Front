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
          status: '400'
        }
      });
      yield put(routerRedux.push('/user/login'));
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.status === '200') {
        sessionStorage.setItem('uID', payload.data.uID);
      }
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
