import { query as queryNewsList } from '../services/newsList';

export default {
  namespace: 'newsList',

  state: {
    list: [],
    loading: false
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const response = yield call(queryNewsList, payload);
      yield put({
        type: 'save',
        payload: response.data
      });
      yield put({
        type: 'changeLoading',
        payload: false
      });
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
    }
  }
};
