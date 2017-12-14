import { getUrlParams } from './utils';

const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png' // Webpack
];
const authority = ['NORMAL', 'EDITOR'];
const sex = ['MALE', 'FEMALE', 'OTHER'];
const userName = ['付小小', '曲丽丽', '林东东', '周星星', '吴加好', '朱偏右', '鱼酱', '乐哥', '谭小仪', '仲尼'];

function fakeUserList(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      uID: `fake-user-${i}`,
      uTelNum: Math.ceil(Math.random(i) * 10000),
      uName: userName[i % 8],
      uSex: sex[i % 3],
      uAge: Math.ceil(Math.random(i) * 100),
      uAuthority: authority[i % 4],
      uAvatar: avatars[i % 8]
    });
  }

  return list;
}

export function getFakeUserList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const currentPage = params.currentPage || 1;
  const pageSize = params.pageSize || 10;
  const result = {
    status: '200',
    msg: '获取用户列表成功',
    data: {
      total: 40,
      pageSize: pageSize,
      currentPage: currentPage,
      list: fakeUserList(pageSize)
    }
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getFakeUserList
};
