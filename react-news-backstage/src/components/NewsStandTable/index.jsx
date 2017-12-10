import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Button, Divider, Tag } from 'antd';
import { TYPE } from '../../utils/utils';
import styles from './index.less';

class NewsStandTable extends PureComponent {
  state = {
    totalCallNo: 0
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        totalCallNo: 0
      });
    }
  }

  handleRowSelectChange = selectedRows => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ totalCallNo });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '新闻ID',
        dataIndex: 'nID'
      },
      {
        title: '新闻标题',
        dataIndex: 'nTitle',
        render: val =>  <span style={{'fontWeight': 'bold'}}>{val}</span>
      },
      {
        title: '新闻类别',
        dataIndex: 'nType',
        render: val => <Tag>{TYPE[val]}</Tag>
      },
      {
        title: '创建人',
        dataIndex: 'createrInfo.uName'
      },
      {
        title: '创建日期',
        dataIndex: 'nCreatedAt',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '操作',
        render: () => (
          <div>
            <Button type="danger" icon="delete">
              删除
            </Button>
          </div>
        )
      }
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination
    };

    return (
      <div className={styles.standardTable}>
        <Table loading={loading} rowKey={record => record.nID} dataSource={list} columns={columns} pagination={paginationProps} onChange={this.handleTableChange} />
      </div>
    );
  }
}

export default NewsStandTable;
