import React, { Component } from 'react';
import { Avatar, Input, Button, Alert, Form, message } from 'antd';
import CommentRow from './CommentRow';
import { addComment } from '../../services/comment';
import styles from './index.less';

const TextArea = Input.TextArea;

@Form.create()
export default class CommentBlock extends Component {
  addCommentNow() {
    const { form, nID } = this.props;
    let params = {
      nID: nID,
      rContent: form.getFieldValue('rContent'),
      prID: ''
    };
    console.log(params);
    addComment(params).then(res => {
      console.log(res);
      if (res.status === '200') {
        message.success('你的评论添加成功');
      } else {
        message.error('你的评论添加失败');
      }
    });
  }
  render() {
    const { currentUser, dataSource: { list } } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.container}>
        {!currentUser.uID && <Alert className={styles.alert} message="Warning" description="你需要登录来发表评论" type="warning" showIcon closable />}
        <Avatar size="large" className={styles.avatar} src={currentUser.uAvatar} />
        {getFieldDecorator('rContent')(
          <TextArea className={styles.textarea} disabled={currentUser.uID ? false : true} placeholder="在这里输入此条新闻的文字内容" autosize={{ minRows: 4, maxRows: 1000 }} />
        )}
        <Button type="primary" size="large" className={styles.submit} disabled={currentUser.uID ? false : true} onClick={this.addCommentNow.bind(this)}>
          发布评论
        </Button>
        {list.map((item, index) => <CommentRow key={index} list={item} />)}
      </div>
    );
  }
}
