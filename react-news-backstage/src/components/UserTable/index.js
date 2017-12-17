import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Button, Tag, message, Input, Icon } from 'antd';
import { SEX, AUTHORITY } from '../../utils/utils';
import styles from './index.less';

class NewsTable extends PureComponent {
  state = {
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    typeArr: []
  };
  onInputChange = e => {
    this.setState({ searchText: e.target.value });
  };
  onSearch = () => {
    const { data: { list } } = this.props;
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      list: list
        .map(record => {
          const match = record.uName.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            uName: (
              <span>
                {record.uName.split(reg).map(
                  (text, i) =>
                    i > 0
                      ? [
                          <span key={record.uID} className={styles.highlight}>
                            {match[0]}
                          </span>,
                          text
                        ]
                      : text
                )}
              </span>
            )
          };
        })
        .filter(record => !!record)
    });
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };
  render() {
    const { data: { list, pagination }, loading } = this.props;
    let { filteredInfo } = this.props;
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: '用户ID',
        key: 'uID',
        dataIndex: 'uID'
      },
      {
        title: '手机号',
        key: 'uTelNum',
        dataIndex: 'uTelNum'
      },
      {
        title: '用户名',
        key: 'uName',
        dataIndex: 'uName',
        render: val => <span style={{ fontWeight: 'bold' }}>{val}</span>,
        filterDropdown: (
          <div className={styles['custom-filter-dropdown']}>
            <Input
              ref={ele => (this.searchInput = ele)}
              placeholder="Search name"
              value={this.state.searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: (
          <Icon
            type="search"
            style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }}
          />
        ),
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible: visible
            },
            () => this.searchInput && this.searchInput.focus()
          );
        }
      },
      {
        title: '性别',
        key: 'uSex',
        dataIndex: 'uSex',
        filters: [
          { text: SEX['MALE'], value: 'MALE' },
          { text: SEX['FEMALE'], value: 'FEMALE' },
          { text: SEX['OTHER'], value: 'OTHER' }
        ],
        filteredValue: filteredInfo.uSex || null,
        render: val => <Tag>{SEX[val]}</Tag>
      },
      {
        title: '年龄',
        key: 'uAge',
        dataIndex: 'uAge'
      },
      {
        title: '权限',
        key: 'uType',
        dataIndex: 'uType',
        filters: [
          { text: AUTHORITY['NORMAL'], value: 'NORMAL' },
          { text: AUTHORITY['EDITOR'], value: 'EDITOR' }
        ],
        filteredValue: filteredInfo.uType || null,
        render: val => <Tag>{AUTHORITY[val]}</Tag>
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>{this.props.actionBtn(record, this.props.reFetchData)}</div>
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
        <Table
          loading={loading}
          rowKey={record => record.uID}
          dataSource={this.state.list || list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default NewsTable;
