import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  let uID = sessionStorage.getItem('uID')
  return request(`/api/getUserInfo?uID=${uID}`);
}
