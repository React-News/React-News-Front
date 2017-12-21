import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/commentList?${stringify(params)}`);
}

export async function addComment(params) {
  let uID = sessionStorage.getItem('uID');
  let newParams = {
    ...params,
    uID
  };
  console.log(newParams);
  return request('/api/addComment', {
    method: 'POST',
    body: newParams
  });
}