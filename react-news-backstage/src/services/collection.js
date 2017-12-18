import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/collectionList?${stringify(params)}`);
}

export async function addCollection(params) {
  let uID = sessionStorage.getItem('uID');
  let newParams = {
    ...params,
    uID
  };
  console.log(newParams);
  return request('/api/addCollection', {
    method: 'POST',
    body: newParams
  });
}

export async function deleteCollection(params) {
  return request('/api/deleteCollection', {
    method: 'POST',
    body: params
  });
}
