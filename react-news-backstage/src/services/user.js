import request from '../utils/request';
// import { stringify } from 'qs';
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  let uID = sessionStorage.getItem('uID');
  return request(`/api/getUserInfo?uID=${uID}`);
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
