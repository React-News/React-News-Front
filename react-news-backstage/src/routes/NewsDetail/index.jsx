import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, Avatar, Icon, Row, Col, Tag, Spin } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { queryNewsDetail } from '../../services/news';
import { TYPE, smoothScrollToTop } from '../../utils/utils';
import classNames from 'classnames';

export default class NewsDetail extends Component {
  state = {
    news: {}
  };
  componentDidMount() {
    let nID = this.props.match.params.nID;
    console.log(nID);
    queryNewsDetail({ nID }).then(res => {
      console.log(res);
      if (res.status === '200') {
        this.setState({
          news: res.data
        });
        smoothScrollToTop();
        console.log(this.state.news);
      } else {
        this.props.dispatch(routerRedux.push('/404'));
      }
    });
  }

  render() {
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
                <span className={styles.createAt}>{moment(news.nCreatedAt).fromNow()}</span>
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
          </Col>
          <Col span={8}>col-12</Col>
        </Row>
      </div>
    );
  }
}
