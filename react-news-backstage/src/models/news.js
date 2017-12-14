import { query as queryNewsList } from '../services/news';

export default {
  namespace: 'news',

  state: {
    data: {
      list: [],
      pagination: {}
    },
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
        data: {
          list: action.payload.list,
          pagination: {
            total: parseInt(action.payload.total),
            pageSize: parseInt(action.payload.pageSize),
            current: parseInt(action.payload.currentPage)
          }
        }
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
