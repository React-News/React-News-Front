import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux, Route, Link } from 'dva/router';
import { Menu, Layout, Icon, Dropdown, Button, Avatar } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
import DocumentTitle from 'react-document-title';
import GlobalFooter from '../components/GlobalFooter';
import { TYPE } from '../utils/utils';
import styles from './IndexLayout.less';
import logo from '../assets/img/logo_with_text.svg';

const links = [
  {
    title: '帮助',
    href: ''
  },
  {
    title: '隐私',
    href: ''
  },
  {
    title: '条款',
    href: ''
  }
];

const copyright = (
  <div>
    Copyright
    <Icon type="copyright" />
    2017 React-News体验技术部出品
  </div>
);

const renderTypeMenuItem = () => {
  let list = [];
  for (let key in TYPE) {
    list.push(<Menu.Item key={key}>{TYPE[key]}</Menu.Item>);
  }
  console.log(list);
  return list;
};

class IndexLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent'
    });
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    const { getRouteData, location } = this.props;
    const { pathname } = location;
    let title = 'React News';
    getRouteData('IndexLayout').forEach(item => {
      if (item.path === pathname) {
        title = `${item.name} - React News`;
      }
    });
    return title;
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({ type: 'login/logout' });
    } else if (key === 'dashboard') {
      this.props.dispatch(routerRedux.push('/dashboard/my-collection'));
    }
  };
  render() {
    const { getRouteData, currentUser } = this.props;
    console.log(this.props);
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="dashboard">
          <Icon type="dashboard" />Dashboard
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <Header className={styles.header}>
              <div className={styles['logo-wrapper']}>
                <img src={logo} alt="logo" className={styles.logo} />
              </div>
              <Menu
                theme="dark"
                mode="horizontal"
                style={{
                  lineHeight: '64px'
                }}
              >
                <SubMenu
                  key="sort"
                  title={
                    <span>
                      <Icon type="api" /> <span> 分类 </span>
                    </span>
                  }
                >
                  {renderTypeMenuItem()}
                </SubMenu>
                <div className={styles.right}>
                  {currentUser.uName ? (
                    <Dropdown overlay={menu}>
                      <span className={`${styles.action} ${styles.account}`}>
                        <Avatar size="small" className={styles.avatar} src={currentUser.uAvatar} /> {currentUser.uName}
                      </span>
                    </Dropdown>
                  ) : (
                    <Link to="/user/login">
                      <Button ghost>
                        <Icon type="login" />登录／注册
                      </Button>
                    </Link>
                  )}
                </div>
              </Menu>
            </Header>
          </div>
          <div>{getRouteData('IndexLayout').map(item => <Route exact={item.exact} key={item.path} path={item.path} component={item.component} />)}</div>
          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}
export default connect(state => ({ currentUser: state.user.currentUser }))(IndexLayout);
