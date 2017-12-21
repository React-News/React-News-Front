import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { message, Avatar, Icon, Row, Col, Tag, Spin } from 'antd';
import CommentBlock from '../../components/CommentBlock';
import moment from 'moment';
import styles from './index.less';
import { addCollection, deleteCollection, isCollected } from '../../services/collection';
import { queryNewsDetail } from '../../services/news';
import { TYPE, smoothScrollToTop } from '../../utils/utils';
import classNames from 'classnames';

@connect(state => ({
  user: state.user,
  comment: state.comment
}))
export default class NewsDetail extends Component {
  state = {
    news: {},
    isCollected: true,
    cID: -1
  };
  confirmCollection() {
    let nID = this.props.match.params.nID;
    isCollected({ nID }).then(res => {
      console.log(res);
      if (res.status === '200') {
        this.setState({
          isCollected: res.data ? true : false,
          cID: res.data ? res.data.cID : -1
        });
      } else {
        this.props.dispatch(routerRedux.push('/exception/404'));
      }
    });
  }
  refreshCommentList() {
    let nID = this.props.match.params.nID;
    this.props.dispatch({
      type: 'comment/fetch',
      payload: {
        nID: nID,
        currentPage: 1,
        pageSize: 10
      }
    });
  }
  componentDidMount() {
    let nID = this.props.match.params.nID;
    this.confirmCollection();
    queryNewsDetail({ nID }).then(res => {
      console.log(res);
      if (res.status === '200') {
        this.setState({
          news: res.data
        });
        smoothScrollToTop();
        console.log(this.state.news);
      } else {
        this.props.dispatch(routerRedux.push('/exception/404'));
      }
    });
    this.refreshCommentList();
  }
  collectNews() {
    let params = {
      nID: this.props.match.params.nID
    };
    console.log(params);
    addCollection(params).then(res => {
      console.log(res);
      if (res.status === '200') {
        this.setState({
          isCollected: true
        });
        message.success('收藏添加成功');
        smoothScrollToTop();
        this.confirmCollection();
      } else {
        message.error('收藏添加失败');
      }
    });
  }
  cancelCollection() {
    this.setState({
      isCollected: false
    });
    let params = {
      cID: this.state.cID
    };
    console.log(params);
    deleteCollection(params).then(res => {
      console.log(res);
      if (res.status === '200') {
        this.setState({
          isCollected: false
        });
        message.success('收藏取消成功');
        smoothScrollToTop();
      } else {
        message.error('收藏取消失败');
      }
    });
  }
  render() {
    let nID = this.props.match.params.nID;
    const { user: { currentUser }, comment: { data, loading } } = this.props;
    const { news } = this.state;
    let newsContent;
    if (news.nContent) {
      newsContent = news.nContent.split('\n').filter(item => item !== '');
    }
    return (
      <div className={styles.container}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 2 }} xl={{ span: 14, offset: 2 }}>
            <h1 className={styles.newsTitle}>{news.nTitle}</h1>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col
            className={styles.newsInfo}
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 14, offset: 2 }}
            xl={{ span: 14, offset: 2 }}
          >
            {news.nCreaterInfo ? (
              <div className={classNames(styles.createrInfo, styles.clearfix)}>
                <div className={styles.avatar}>
                  <Avatar src={news.nCreaterInfo.uAvatar} size="large" />
                </div>
                <span className={styles.name}>{news.nCreaterInfo.uName}</span>
                <br />
                <span className={styles.createAt}>{moment(news.nCreatedAt).format('YYYY-MM-DD  hh:mm')}</span>
                <Tag color="#108ee9" className={styles.type}>
                  {TYPE[news.nType]}
                </Tag>
              </div>
            ) : (
              <Spin />
            )}
            <div className={styles.cover}>
              <img src={news.nImg} width="100%" alt="cover" />
            </div>
            {newsContent ? (
              newsContent.map((item, index) => (
                <p className={styles.content} key={index}>
                  {item}
                </p>
              ))
            ) : (
              <Spin />
            )}
            <div className={styles.action}>
              <div className={styles.collection}>
                <Icon type="star" className={styles.star} onClick={this.cancelCollection.bind(this)} style={{ display: this.state.isCollected ? 'inline-block' : 'none' }} />
                <Icon type="star-o" className={styles.starO} onClick={this.collectNews.bind(this)} style={{ display: !this.state.isCollected ? 'inline-block' : 'none' }} />
              </div>
            </div>
          </Col>
          <Col span={8}>col-12</Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 2 }} xl={{ span: 14, offset: 2 }}>
            <CommentBlock currentUser={currentUser} dataSource={data} refreshCommentList={this.refreshCommentList} nID={nID} />
          </Col>
        </Row>
      </div>
    );
  }
}
