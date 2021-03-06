import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, Modal, message } from 'antd';
import CollectionTable from '../../components/CollectionTable';
import StandardFormRow from '../../components/StandardFormRow';
import { deleteCollection } from '../../services/collection';
import styles from './index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(state => ({
  collection: state.collection,
  user: state.user
}))
@Form.create()
export default class Collection extends PureComponent {
  state = {
    filteredInfo: {
      nType: []
    }
  };

  componentDidMount() {
    this.reFetchNewsList();
  }
  handleFormSubmit = () => {
    this.reFetchNewsList();
  };
  reFetchNewsList() {
    const { user: { currentUser } } = this.props;
    const { form } = this.props;
    const filters = Object.keys(this.state.filteredInfo).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(this.state.filteredInfo[key]);
      return newObj;
    }, {});
    this.props.dispatch({
      type: 'collection/fetch',
      payload: {
        uID: currentUser.uID,
        currentPage: 1,
        pageSize: 10,
        keywd: form.getFieldValue('keywd') || '',
        ...filters
      }
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { user: { currentUser } } = this.props;
    const { dispatch, form } = this.props;
    this.setState({
      filteredInfo: filtersArg
    });
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      uID: currentUser.uID,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      keywd: form.getFieldValue('keywd') || '',
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    console.log(params);
    dispatch({
      type: 'collection/fetch',
      payload: params
    });
  };
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <StandardFormRow title="按标题搜索" grid last>
          <Row>
            <Col lg={16} md={24} sm={24} xs={24}>
              <FormItem>{getFieldDecorator('keywd')(<Input.Search placeholder="请输入" enterButton="搜索" onSearch={this.handleFormSubmit} style={{ width: '100%' }} />)}</FormItem>
            </Col>
          </Row>
        </StandardFormRow>
      </Form>
    );
  }
  renderActionBtn(record, reFetchNewsList) {
    const deleteNewsConfirm = cID => {
      confirm({
        title: '取消收藏',
        content: '你真的要取消此条新闻的收藏吗？',
        onOk() {
          let params = {
            cID: cID
          };
          return new Promise((resolve, reject) => {
            return deleteCollection(params).then(res => {
              console.log(res);
              if (res.status === '200') {
                message.success('收藏取消成功');
                reFetchNewsList();
                resolve();
              } else {
                reject();
              }
            });
          }).catch(() => message.error('收藏取消失败'));
        },
        onCancel() {}
      });
    };
    return (
      <Button type="danger" icon="delete" onClick={deleteNewsConfirm.bind(this, record.cID)}>
        删除
      </Button>
    );
  }
  render() {
    const { collection: { loading, data } } = this.props;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} style={{ marginTop: '24px' }}>
          <div className={styles.tableList}>
            <CollectionTable
              loading={loading}
              data={data}
              onChange={this.handleStandardTableChange}
              filteredInfo={this.state.filteredInfo}
              actionBtn={this.renderActionBtn}
              reFetchData={this.reFetchNewsList.bind(this)}
            />
          </div>
        </Card>
      </div>
    );
  }
}
