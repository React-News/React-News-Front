import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
  Card,
  List,
  Tag,
  Icon,
  Avatar,
  Row,
  Col,
  Button,
  Input,
  Modal,
  message
} from 'antd';
import { TYPE } from '../../utils/utils';
import StandardFormRow from '../../components/StandardFormRow';
import TagSelect from '../../components/TagSelect';
import styles from './index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const pageSize = 5;

@Form.create()
@connect(state => ({
  collection: state.collection,
  user: state.user
}))
export default class Collection extends Component {
  componentDidMount() {
    this.fetchMore();
  }

  fetchMore = () => {
    console.log(this.props);
    console.log({
      count: pageSize,
      uID: this.props.user.currentUser.uID,
      type: ['SPORT', 'OTHER'],
      keywd: 'Hello'
    });
    this.props.dispatch({
      type: 'collection/fetch',
      payload: {
        count: pageSize,
        uID: '1',
        type: ['SPORT', 'OTHER'],
        keywd: 'Hello'
      }
    });
  };
  showDeleteConfirm = cID => {
    confirm({
      title: '警告',
      content: '你想取消此条新闻的收藏么?' + cID,
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        })
          .then(() => {
            message.success('收藏取消成功');
          })
          .catch(() => console.log('Oops errors!'));
      },
      onCancel() {}
    });
  };
  render() {
    const { form, collection: { list, loading } } = this.props;
    const { getFieldDecorator } = form;

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const ListContent = ({ data: { newsInfo, createrInfo } }) => (
      <div className={styles.listContent}>
        <div className={styles.description}>{newsInfo.desc}</div>
        <div className={styles.extra}>
          <Avatar src={createrInfo.uAvatar} size="small" />
          {createrInfo.uName}
          <em>{moment(newsInfo.createdAt).format('YYYY-MM-DD hh:mm')}</em>
        </div>
      </div>
    );
    const loadMore =
      list.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button
            onClick={this.fetchMore}
            style={{ paddingLeft: 48, paddingRight: 48 }}
          >
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    return (
      <div>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow
              title="所属类目"
              block
              style={{ paddingBottom: 11 }}
            >
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect onChange={this.handleFormSubmit}>
                    <TagSelect.Option value="SPORT">体育</TagSelect.Option>
                    <TagSelect.Option value="TECH">科技</TagSelect.Option>
                    <TagSelect.Option value="SOCIETY">社会</TagSelect.Option>
                    <TagSelect.Option value="FINANCE">财经</TagSelect.Option>
                    <TagSelect.Option value="GAME">游戏</TagSelect.Option>
                    <TagSelect.Option value="CAR">汽车</TagSelect.Option>
                    <TagSelect.Option value="OTHER">其他</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="按标题搜索" grid last>
              <Row>
                <Col lg={16} md={24} sm={24} xs={24}>
                  <Input.Search
                    placeholder="请输入"
                    enterButton="搜索"
                    onSearch={this.handleFormSubmit}
                  />
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                key={item.cID}
                actions={[
                  <IconText type="star-o" text={item.starNum} key="starNum" />,
                  <IconText
                    type="message"
                    text={item.commentNum}
                    key="commentNum"
                  />,
                  <Button
                    type="danger"
                    icon="delete"
                    size="small"
                    onClick={this.showDeleteConfirm.bind(this, item.id)}
                    key="deleteConlection"
                  >
                    删除收藏
                  </Button>
                ]}
                extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={
                    <a className={styles.listItemMetaTitle} href={item.href}>
                      {item.newsInfo.nTitle}
                    </a>
                  }
                  description={
                    <span>
                      <Tag>{TYPE[item.newsInfo.nType]}</Tag>
                    </span>
                  }
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}
