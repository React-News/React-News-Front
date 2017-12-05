import { query as queryUsers, queryCurrent, editUserInfo } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response
      });
      yield put({
        type: 'changeLoading',
        payload: false
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data
      });
    },
    *editUserInfo({ payload }, { call, put }) {
      const response = yield call(editUserInfo, payload);
      if (response.status === '200') {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data
        });
      } else {
        console.log('修改个人信息失败');
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      };
    }
  }
};
