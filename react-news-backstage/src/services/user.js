import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/users?${stringify(params)}`);
}

export async function queryCurrent() {
  let uID = sessionStorage.getItem('uID');
  return request(`/api/userInfo?uID=${uID}`);
}

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
