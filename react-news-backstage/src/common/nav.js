import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) =>
  dynamic({
    app,
    models: () => models.map(m => import(`../models/${m}.js`)),
    component: () => component
  });

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user'], import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: 'Dashboard', // for breadcrumb
    path: '/dashboard',
    children: [
      {
        name: '修改个人信息',
        path: '/dashboard/edit-my-info',
        icon: 'edit',
        component: dynamicWrapper(app, [], import('../routes/EditMyInfo'))
      },
      {
        name: '我的收藏',
        path: '/dashboard/my-collection',
        icon: 'star',
        component: dynamicWrapper(app, ['collection'], import('../routes/Collection'))
      },
      // {
      //   name: '我的评论',
      //   path: '/dashboard/my-comment',
      //   icon: 'message',
      //   component: dynamicWrapper(app, ['list'], import('../routes/MyComment'))
      // },
      {
        name: '编辑特权',
        path: '/dashboard/editer-authority',
        icon: 'contacts',
        children: [
          {
            name: '新增新闻',
            path: 'add-news',
            component: dynamicWrapper(app, [], import('../routes/EditerAuthority/AddNews'))
          },
          {
            name: '删除新闻',
            path: 'delete-news',
            component: dynamicWrapper(app, ['news'], import('../routes/EditerAuthority/DeleteNews'))
          }
        ]
      },
      {
        name: '删除新闻',
        path: '/dashboard/delete-news-admin',
        icon: 'delete',
        component: dynamicWrapper(app, ['news'], import('../routes/DeleteNews'))
      },
      {
        name: '用户列表',
        path: '/dashboard/user-list',
        icon: 'user',
        component: dynamicWrapper(app, [], import('../routes/UserList'))
      }
    ]
  },
  {
    component: dynamicWrapper(app, [], import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], import('../routes/User/Login'))
          },
          {
            name: '注册',
            path: 'register',
            component: dynamicWrapper(app, ['register'], import('../routes/User/Register'))
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dynamicWrapper(app, [], import('../routes/User/RegisterResult'))
          }
        ]
      }
    ]
  },
  {
    component: dynamicWrapper(app, ['user'], import('../layouts/IndexLayout')),
    path: '/',
    layout: 'IndexLayout',
    children: [
      {
        name: '展示页',
        icon: 'tag',
        path: '/',
        children: [
          {
            name: '首页',
            path: '/',
            component: dynamicWrapper(app, ['news'], import('../routes/Index'))
          },
          {
            name: 'newsList',
            path: '/:nType',
            component: dynamicWrapper(app, ['news'], import('../routes/Index'))
          },
          {
            name: '详情页',
            path: '/newsDetail',
            children: [
              {
                name: 'newsList2',
                path: '/:nID',
                component: dynamicWrapper(app, ['news', 'comment'], import('../routes/NewsDetail'))
              }
            ]
          }
        ]
      },
      {
        name: '异常',
        path: 'exception',
        icon: 'warning',
        children: [
          {
            name: '403',
            path: '403',
            component: dynamicWrapper(app, [], import('../routes/Exception/403'))
          },
          {
            name: '404',
            path: '404',
            component: dynamicWrapper(app, [], import('../routes/Exception/404'))
          },
          {
            name: '500',
            path: '500',
            component: dynamicWrapper(app, [], import('../routes/Exception/500'))
          }
        ]
      }
    ]
  }
];
