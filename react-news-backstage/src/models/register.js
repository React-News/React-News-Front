import { notification } from 'antd';
import { register } from '../services/api';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    userData: {
      uID: undefined,
      uTelNum: undefined
    }
  },

  effects: {
    *submit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true
      });
      yield console.log(payload)
      const response = yield call(register, payload);
      if (response.status === '200') {
        yield put({
          type: 'successRegister',
          payload: response.data
        });
      } else {
        yield notification.error({
          message: '失败',
          description: response.msg
        });
        yield console.log(response);
      }
      yield put({
        type: 'registerHandle',
        payload: response
      });
      yield put({
        type: 'changeSubmitting',
        payload: false
      });
    }
  },

  reducers: {
    registerHandle(state, { payload }) {
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
    },
    successRegister(state, { payload }) {
      notification.success({
        message: '成功',
        description: '恭喜你注册成功'
      });
      return {
        ...state,
        userData: {
          uID: payload.uID,
          uTelNum: payload.uTelNum,
          uPasswd: payload.uPasswd
        }
      };
    }
  }
};
