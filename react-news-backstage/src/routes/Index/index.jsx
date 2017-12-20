import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Avatar, Icon, Row, Col, Tag } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { TYPE } from '../../utils/utils';
@connect(state => ({
  news: state.news
}))
export default class Index extends Component {
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
  }

  render() {
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    const { news: { loading, data } } = this.props;
    let { nType } = this.props.match.params;
    console.log(this.props);
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
              pagination={data.pagination}
              dataSource={data.list}
              loading={loading}
              className={styles.newsList}
              renderItem={item => (
                <List.Item
                  key={item.nID}
                  actions={[<IconText type="star-o" text={item.starNum} key="starNum" />, <IconText type="message" text={item.commentNum} key="commentNum" />]}
                  extra={<img className={styles.imgResponsive} alt="logo" src={item.nImg} />}
                >
                  <span className={styles.listExtra}>
                    <Avatar src={item.createrInfo.uAvatar} size="small" />
                    {item.createrInfo.uName} 发布于 <em>{moment(item.nCreatedAt).format('YYYY-MM-DD hh:mm')}</em>
                  </span>

                  <List.Item.Meta
                    avatar={<Avatar src={item.createrInfo.uAvatar} />}
                    title={<a href={`/newsDetail/${item.nID}`}>{item.nTitle}</a>}
                    description={<Tag>{TYPE[item.nType]}</Tag>}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col span={8}>col-12</Col>
        </Row>
      </div>
    );
  }
}
