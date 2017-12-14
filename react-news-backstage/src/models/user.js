import { message } from 'antd';
import { query as queryUsers, queryCurrent, editUserInfo } from '../services/user';

export default {
  namespace: 'user',

  state: {
    listData: {
      list: [],
      pagination: {}
    },
    loading: false,
    editUserInfoStatus: '400',
    currentUser: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response.data
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
    *initEditUserInfo(_, { call, put }) {
      yield put({
        type: 'setEditUserInfoStatus',
        payload: '400'
      });
    },
    *editUserInfo({ payload }, { call, put }) {
      const response = yield call(editUserInfo, payload);
      yield put({
        type: 'setEditUserInfoStatus',
        payload: response.status
      });
      if (response.status === '200') {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data
        });
        yield message.success('修改个人信息成功');
      } else {
        yield message.error('修改个人信息失败');
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        listData: {
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
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      };
    },
    setEditUserInfoStatus(state, action) {
      return {
        ...state,
        editUserInfoStatus: action.payload
      };
    }
  }
};
