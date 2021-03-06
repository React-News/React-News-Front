import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Dropdown, message, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Debounce from 'lodash-decorators/debounce';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import styles from './BasicLayout.less';
import logo from '../assets/img/logo.svg';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200
  }
};

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object
  };
  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = props.navData.reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props)
    };
  }
  getChildContext() {
    const { location, navData, getRouteData } = this.props;
    const routeData = getRouteData('BasicLayout');
    const firstMenuData = navData.reduce((arr, current) => arr.concat(current.children), []);
    const menuData = this.getMenuData(firstMenuData, '');
    const breadcrumbNameMap = {};

    routeData.concat(menuData).forEach(item => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return { location, breadcrumbNameMap };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent'
    });
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  onCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    });
  };
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout'
      });
    }
  };
  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach(item => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  };
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map(item => {
      // 任何人都看不到的路由
      if (!item.name || item.name === '异常' || item.name === '帐户' || item.name === '展示页') {
        return null;
      }
      // 编辑和普通用户都看不到的路由
      if (this.props.currentUser.uAuthority === 'EDITOR' || this.props.currentUser.uAuthority === 'NORMAL') {
        if (item.name === '用户列表' || (item.name === '删除新闻' && item.path === '/dashboard/delete-news-admin')) {
          return null;
        }
      }
      // 普通用户看不到的路由
      if (this.props.currentUser.uAuthority === 'NORMAL') {
        if (item.name === '编辑特权') {
          return null;
        }
      }
      console.log(item);
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path}>
          {/^https?:\/\//.test(itemPath) ? (
            <a href={itemPath} target={item.target}>
              {icon}
              <span>{item.name}</span>
            </a>
          ) : (
            <Link to={itemPath} target={item.target} replace={itemPath === this.props.location.pathname}>
              {icon}
              <span>{item.name}</span>
            </Link>
          )}
        </Menu.Item>
      );
    });
  }
  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    let title = 'React News';
    getRouteData('BasicLayout').forEach(item => {
      if (item.path === pathname) {
        title = `${item.name} - React News`;
      }
    });
    return title;
  }
  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey));
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys]
    });
  };
  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed
    });
    this.triggerResizeEvent();
  };
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { currentUser, collapsed, getRouteData } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
          openKeys: this.state.openKeys
        };

    const layout = (
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="md" onCollapse={this.onCollapse} width={256} className={styles.sider}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="logo" />
              <h1>React News</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon className={styles.trigger} type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
            <div className={styles.right}>
              {currentUser.uName ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    {currentUser.uAvatar ? (
                      <Avatar size="small" className={styles.avatar} src={currentUser.uAvatar} />
                    ) : (
                      <Avatar size="small" className={styles.avatar}>
                        {currentUser.uName[0]}
                      </Avatar>
                    )}
                    {currentUser.uName}
                  </span>
                </Dropdown>
              ) : (
                <Spin size="small" style={{ marginLeft: 8 }} />
              )}
            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {getRouteData('BasicLayout').map(item => <Route exact={item.exact} key={item.path} path={item.path} component={item.component} />)}
              <Redirect exact from="/" to="/my-collection" />
              <Route component={NotFound} />
            </Switch>
            <GlobalFooter
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2017 React-News体验技术部出品
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>{params => <div className={classNames(params)}>{layout}</div>}</ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed
}))(BasicLayout);
