import { getUrlParams } from './utils';

const titles = [
  '震惊！18岁少年竟然在宿舍干出这种事',
  '内蒙古财经大学有智力的人TOP10',
  '高通又起新官司，要直击苹果的痛处',
  '《绝地求生》在 Xbox One X 上能以 60fps 运行',
  '震惊！男人看了会沉默，女人看了会流泪！',
  'React',
  'Vue',
  'Webpack'
];
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
const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/HrxcVbrKnCJOZvtzSqjN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/alaPpKWajEbIYEUvvVNf.png',
  'https://gw.alipayobjects.com/zos/rmsportal/RLwlKSYGSXGHuWSojyvp.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png'
];
const types = ['SPORT', 'TECH', 'SOCIETY', 'FINANCE', 'GAME', 'CAR', 'OTHER'];
const user = ['付小小', '曲丽丽', '林东东', '周星星', '吴加好', '朱偏右', '鱼酱', '乐哥', '谭小仪', '仲尼'];

function fakeNewsList(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      nID: `fake-list-${i}`,
      nTitle: titles[i % 8],
      nType: types[i % 7],
      nImg: covers[i % 4],
      nContext: '示例文本～这是示例文本～示例文本～这是示例文本～示例文本～这是示例文本～示例文本～这是示例文本～',
      nCreatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createrInfo: {
        uID: `fake-user-${i}`,
        uName: user[i % 10],
        uAvatar: avatars[i % 8]
      }
    });
  }

  return list;
}

export function getFakeNewsList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const count = params.count * 1 || 20;

  const result = {
    status: '200',
    msg: '获取新闻列表成功',
    data: fakeNewsList(count)
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getFakeNewsList
};
