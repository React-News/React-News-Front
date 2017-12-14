import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Switch, Modal, message } from 'antd';
import NewsTable from '../../components/UserTable';
import StandardFormRow from '../../components/StandardFormRow';
import { deleteNews } from '../../services/news';
import styles from './index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(state => ({
  user: state.user
}))
@Form.create()
export default class UserList extends PureComponent {
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
    const { form } = this.props;
    const filters = Object.keys(this.state.filteredInfo).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(this.state.filteredInfo[key]);
      return newObj;
    }, {});
    this.props.dispatch({
      type: 'user/fetch',
      payload: {
        uID: '',
        currentPage: 1,
        pageSize: 10,
        keywd: form.getFieldValue('keywd') || '',
        ...filters
      }
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
      uID: '',
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
      type: 'user/fetch',
      payload: params
    });
  };
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <StandardFormRow title="按用户名搜索" grid last>
          <Row>
            <Col lg={16} md={24} sm={24} xs={24}>
              <FormItem>
                {getFieldDecorator('keywd')(
                  <Input.Search
                    placeholder="请输入"
                    enterButton="搜索"
                    onSearch={this.handleFormSubmit}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </StandardFormRow>
      </Form>
    );
  }
  renderActionBtn(record, reFetchNewsList) {
    const deleteNewsConfirm = uID => {
      confirm({
        title: '删除新闻',
        content: '你真的要删除此条新闻吗？',
        onOk() {
          let params = {
            uID: uID
          };
          return new Promise((resolve, reject) => {
            return deleteNews(params).then(res => {
              console.log(res);
              if (res.status === '200') {
                message.success('此条新闻删除成功');
                reFetchNewsList();
                resolve();
              } else {
                reject();
              }
            });
          }).catch(() => message.error('此条新闻删除失败'));
        },
        onCancel() {}
      });
    };
    const changeUserType = (checked) => {
      console.log(checked, record);
      
    };
    return (
      <div>
        <Switch
          checkedChildren="编辑用户"
          unCheckedChildren="普通用户"
          defaultChecked={record.uType === 'EDITOR'}
          onChange={changeUserType}
        />
      </div>
    );
  }
  render() {
    const { user: { loading, listData } } = this.props;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} style={{ marginTop: '24px' }}>
          <div className={styles.tableList}>
            <NewsTable
              loading={loading}
              data={listData}
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
