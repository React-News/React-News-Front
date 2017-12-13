import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/newsList?${stringify(params)}`);
}

export async function queryNewsDetail(params) {
  return request(`/api/newsDitail?${stringify(params)}`);
}

export async function addNews(params) {
  let uID = sessionStorage.getItem('uID');
  let newParams = {
    ...params,
    uID
  };
  console.log(newParams);
  return request('/api/addNews', {
    method: 'POST',
    body: newParams
  });
}
export async function deleteNews(params) {
  return request('/api/deleteNews', {
    method: 'POST',
    body: params
  });
}
