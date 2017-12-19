import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import { Menu, Layout, Icon } from 'antd';
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
    Copyright <Icon type="copyright" /> 2017 React-News体验技术部出品
  </div>
);

const renderTypeMenuItem = () => {
  let list = [];
  for(let key in TYPE) {
    list.push(<Menu.Item key={key}>{TYPE[key]}</Menu.Item>)
  }
  console.log(list)
  return list;
}

class IndexLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object
  };
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
  render() {
    const { getRouteData } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <Header className={styles.header}>
              <div className={styles['logo-wrapper']}>
                <img src={logo} alt="logo" className={styles.logo} />
              </div>
              <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
                <SubMenu
                  key="sort"
                  title={
                    <span>
                      <Icon type="api" />
                      <span>分类</span>
                    </span>
                  }
                >
                  {renderTypeMenuItem()}
                </SubMenu>
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

export default IndexLayout;
