import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/users?${stringify(params)}`);
}

export async function queryCurrent() {
  let uID = sessionStorage.getItem('uID');
  return request(`/api/userInfo?uID=${uID}`);
}
// 实际上是在改自己的信息 0.0
export async function editUserInfo(params) {
  let uID = sessionStorage.getItem('uID');
  let newParams = {
    ...params,
    uID
  };
  console.log(newParams)
  return request('/api/editUserInfo', {
    method: 'POST',
    body: newParams
  });
}
// 修改用户权限
export async function editUserType(params) {
  console.log(params)
  return request('/api/editUserType', {
    method: 'POST',
    body: params
  });
}
