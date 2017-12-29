import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { List, Avatar, Icon, Row, Col, Tag } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { TYPE, smoothScrollToTop } from '../../utils/utils';
@connect(state => ({
  news: state.news
}))
export default class Index extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.nType !== nextProps.match.params.nType) {
      console.log(this.props.match.params.nType, nextProps.match.params.nType);
      this.props.dispatch({
        type: 'news/fetch',
        payload: {
          uID: '',
          currentPage: 1,
          pageSize: 10,
          keywd: '',
          nType: nextProps.match.params.nType
        }
      });
      smoothScrollToTop()
    }
  }
  componentDidMount() {
    let nType = this.props.match.params.nType || '';
    this.props.dispatch({
      type: 'news/fetch',
      payload: {
        uID: '',
        currentPage: 1,
        pageSize: 10,
        keywd: '',
        nType: nType
      }
    });
    smoothScrollToTop()
  }
  onChangePagination = pagination => {
    const { dispatch } = this.props;
    console.log(pagination);
    const params = {
      uID: '',
      currentPage: pagination,
      pageSize: 10
    };
    console.log(params);
    dispatch({
      type: 'news/fetch',
      payload: params
    });
    smoothScrollToTop()
  };

  render() {
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    const { news: { loading, data } } = this.props;
    let { nType } = this.props.match.params;

    const newPagination = {
      ...data.pagination,
      onChange: this.onChangePagination
    };
    return (
      <div className={styles.container}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 2 }} xl={{ span: 14, offset: 2 }}>
            <h1 className={styles.sortTitle}>{TYPE[nType] || '全部'}</h1>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 2 }} xl={{ span: 14, offset: 2 }}>
            <List
              itemLayout="vertical"
              size="large"
              pagination={newPagination}
              dataSource={data.list}
              loading={loading}
              className={styles.newsList}
              renderItem={item => (
                <List.Item
                  key={item.nID}
                  actions={[<IconText type="star-o" text={item.starNum} key="starNum" />, <IconText type="message" text={item.commentNum} key="commentNum" />]}
                  extra={<div className={styles.imgResponsive}><img alt="logo" src={item.nImg} /></div>}
                >
                  <span className={styles.listExtra}>
                    <Avatar src={item.createrInfo.uAvatar} size="small" />
                    {item.createrInfo.uName} 发布于 <em>{moment(item.nCreatedAt).fromNow()}</em>
                  </span>

                  <List.Item.Meta
                    avatar={<Avatar src={item.createrInfo.uAvatar} />}
                    title={<Link to={`/newsDetail/${item.nID}`}>{item.nTitle}</Link>}
                    description={<Tag>{TYPE[item.nType]}</Tag>}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
