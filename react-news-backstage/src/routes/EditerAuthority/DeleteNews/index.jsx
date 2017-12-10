import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Modal, message } from 'antd';
import NewsStandTable from '../../../components/NewsStandTable';
import StandardFormRow from '../../../components/StandardFormRow';
import TagSelect from '../../../components/TagSelect';
import styles from './index.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(state => ({
  newsList: state.newsList
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    selectedRows: [],
    formValues: {}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newsList/fetch'
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(',')
          },
          callback: () => {
            this.setState({
              selectedRows: []
            });
          }
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };

  handleAddInput = e => {
    this.setState({
      addInputValue: e.target.value
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
          <FormItem help={this.state.help}>
            {getFieldDecorator('nType', {
              rules: [
                {
                  validator: this.checkType
                }
              ],
              initialValue: ['SPORT', 'TECH', 'SOCIETY', 'FINANCE', 'GAME', 'CAR', 'OTHER']
            })(
              <TagSelect onChange={this.handleFormSubmit} expandable>
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
              <FormItem>{getFieldDecorator('keywd')(<Input.Search placeholder="请输入" enterButton="搜索" onSearch={this.handleFormSubmit} style={{ width: '100%' }} />)}</FormItem>
            </Col>
          </Row>
        </StandardFormRow>
      </Form>
    );
  }

  render() {
    const { newsList: { loading, list } } = this.props;
    const { selectedRows, addInputValue } = this.state;
    list.list = list;
    list.pagination = { total: 46, pageSize: 10, current: 1 };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} style={{'marginTop': '24px'}}>
          <div className={styles.tableList}>
            <NewsStandTable selectedRows={selectedRows} loading={loading} data={list} onSelectRow={this.handleSelectRows} onChange={this.handleStandardTableChange} />
          </div>
        </Card>
      </div>
    );
  }
}
