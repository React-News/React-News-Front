import React, { Component } from 'react';
import { Avatar, Input, Button } from 'antd';
import CommentRow from './CommentRow';
import styles from './index.less';

const TextArea = Input.TextArea;

export default class CommentBlock extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Avatar size="large" className={styles.avatar}>Me</Avatar>
        <TextArea className={styles.textarea} placeholder="在这里输入此条新闻的文字内容" autosize={{ minRows: 4, maxRows: 1000 }} />
        <Button type="primary" size="large" className={styles.submit}>发布评论</Button>
        <CommentRow />
        <CommentRow />
      </div>
    );
  }
}
