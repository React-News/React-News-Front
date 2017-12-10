import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Button, Modal, Tag, message } from 'antd';
import { TYPE } from '../../utils/utils';
import styles from './index.less';

const confirm = Modal.confirm;

class NewsStandTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };
  deleteNewsConfirm = nID => {
    confirm({
      title: '删除新闻',
      content: '你真的要删除此条新闻吗？',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        })
          .then(() => {
            message.success(`新闻${nID}删除成功`);
          })
          .catch(() => console.log('Oops errors!'));
      },
      onCancel() {}
    });
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
        render: val => <span style={{ fontWeight: 'bold' }}>{val}</span>
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
        render: (text, record) => (
          <div>
            <Button type="danger" icon="delete" onClick={this.deleteNewsConfirm.bind(this, record.nID)}>
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
