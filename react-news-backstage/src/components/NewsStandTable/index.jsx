import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Button, Tag, message, Input, Icon } from 'antd';
import { TYPE } from '../../utils/utils';
import styles from './index.less';

class NewsStandTable extends PureComponent {
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
          const match = record.nTitle.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            nTitle: (
              <span>
                {record.nTitle.split(reg).map(
                  (text, i) =>
                    i > 0
                      ? [
                          <span key={record.nID} className={styles.highlight}>
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
        title: '新闻ID',
        key: 'nID',
        dataIndex: 'nID'
      },
      {
        title: '新闻标题',
        key: 'nTitle',
        dataIndex: 'nTitle',
        render: val => <span style={{ fontWeight: 'bold' }}>{val}</span>,
        filterDropdown: (
          <div className={styles['custom-filter-dropdown']}>
            <Input ref={ele => (this.searchInput = ele)} placeholder="Search name" value={this.state.searchText} onChange={this.onInputChange} onPressEnter={this.onSearch} />
            <Button type="primary" onClick={this.onSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
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
        title: '新闻类别',
        key: 'nType',
        dataIndex: 'nType',
        filters: [
          { text: TYPE['SPORT'], value: 'SPORT' },
          { text: TYPE['TECH'], value: 'TECH' },
          { text: TYPE['SOCIETY'], value: 'SOCIETY' },
          { text: TYPE['FINANCE'], value: 'FINANCE' },
          { text: TYPE['GAME'], value: 'GAME' },
          { text: TYPE['CAR'], value: 'CAR' },
          { text: TYPE['OTHER'], value: 'OTHER' }
        ],
        filteredValue: filteredInfo.nType || null,
        render: val => <Tag>{TYPE[val]}</Tag>
      },
      {
        title: '创建人',
        key: 'uName',
        dataIndex: 'createrInfo.uName'
      },
      {
        title: '创建日期',
        key: 'nCreatedAt',
        dataIndex: 'nCreatedAt',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => <div>{this.props.actionBtn(record, this.props.reFetchData)}</div>
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
          rowKey={record => record.nID}
          dataSource={this.state.list || list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default NewsStandTable;
