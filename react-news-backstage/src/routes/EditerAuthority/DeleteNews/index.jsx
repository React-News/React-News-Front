import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, message } from 'antd';
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
export default class DeleteNews extends PureComponent {
  state = {
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
    console.log(params);
    dispatch({
      type: 'newsList/fetch',
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

  render() {
    const { newsList: { loading, data } } = this.props;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} style={{ marginTop: '24px' }}>
          <div className={styles.tableList}>
            <NewsStandTable loading={loading} data={data} onChange={this.handleStandardTableChange} />
          </div>
        </Card>
      </div>
    );
  }
}
