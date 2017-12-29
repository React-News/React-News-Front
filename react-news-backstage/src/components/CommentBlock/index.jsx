import React, { Component } from 'react';
import { Avatar, Input, Button, Alert, Form, message, Modal } from 'antd';
import CommentRow from './CommentRow';
import { addComment } from '../../services/comment';
import styles from './index.less';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const CommentCreateForm = Form.create()(props => {
  const { visible, onCancel, onCreate, form } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal visible={visible} title="回复" okText="发送" onCancel={onCancel} onOk={onCreate}>
      <Form layout="vertical">
        <FormItem label="回复">
          {getFieldDecorator('rContent')(<TextArea className={styles.textarea} placeholder="在这里输入你的留言" autosize={{ minRows: 4, maxRows: 1000 }} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@Form.create()
export default class CommentBlock extends Component {
  state = {
    visible: false
  };
  showModal = prID => {
    this.setState({
      visible: true,
      prID: prID
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = () => {
    const form2 = this.form;
    const { form, nID } = this.props;
    form2.validateFields((err, values) => {
      if (err) {
        return;
      }
      let params = {
        nID: nID,
        rContent: form2.getFieldValue('rContent'),
        prID: this.state.prID
      };
      console.log('Received values of form: ', params);
      addComment(params).then(res => {
        console.log(res);
        if (res.status === '200') {
          message.success('你的回复添加成功');
          this.props.refreshCommentList();
        } else {
          message.error('你的回复添加失败');
        }
      });
      form2.resetFields();
      this.setState({ visible: false });
    });
  };
  saveFormRef = form => {
    this.form = form;
  };
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
        this.props.refreshCommentList();
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
        <CommentCreateForm ref={this.saveFormRef} visible={this.state.visible} onCancel={this.handleCancel} onCreate={this.handleCreate} />
        {!currentUser.uID && <Alert className={styles.alert} message="Warning" description="你需要登录来发表评论" type="warning" showIcon closable />}
        <Avatar size="large" className={styles.avatar} src={currentUser.uAvatar} />
        {getFieldDecorator('rContent')(
          <TextArea className={styles.textarea} disabled={currentUser.uID ? false : true} placeholder="在这里输入你的留言" autosize={{ minRows: 4, maxRows: 1000 }} />
        )}
        <Button type="primary" size="large" className={styles.submit} disabled={currentUser.uID ? false : true} onClick={this.addCommentNow.bind(this)}>
          发布评论
        </Button>
        {list.map((item, index) => <CommentRow key={index} list={item} currentUser={currentUser} showCommentModal={this.showModal} />)}
      </div>
    );
  }
}
