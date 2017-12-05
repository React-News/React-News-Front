import { queryCollectionList } from '../services/api';

export default {
  namespace: 'collection',

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
      const response = yield call(queryCollectionList, payload);
      yield console.log(response);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : []
      });
      yield put({
        type: 'changeLoading',
        payload: false
      });
    }
  },

  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload)
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
