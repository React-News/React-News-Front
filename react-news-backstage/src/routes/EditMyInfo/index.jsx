import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Radio, InputNumber, Upload, message, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
@connect(state => ({
  user: state.user
}))
@Form.create()
class EditMyInfo extends Component {
  state = {
    imageUrl: null
  };
  componentDidMount() {
    let currentUser = this.props.user.currentUser;
    this.setState({
      imageUrl: currentUser.uAvatar
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.editUserInfoStatus === '200') {
      this.props.dispatch(routerRedux.push('/dashboard/my-collection'));
      this.props.dispatch({
        type: 'user/initEditUserInfo'
      });
    }
  }
  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    const isImg = file.type === 'image/png' || file.type === 'image/jpeg';
    if (!isImg) {
      message.error('你应该上传图片作为头像');
    }
    if (isImg && !isLt2M) {
      message.error('你上传的图片大小不应超过2M');
    }
    if (isLt2M && isImg) {
      getBase64(file, imageUrl => this.setState({ imageUrl }));
    }
    return false;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.uAvatar = this.state.imageUrl;
        this.props.dispatch({
          type: 'user/editUserInfo',
          payload: values
        });
      } else {
        console.log(err);
      }
    });
  };
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { currentUser } = this.props.user;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 3 }
      }
    };
    const imageUrl = this.state.imageUrl;
    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 24 }}>
            <FormItem {...formItemLayout} label="昵称" hasFeedback>
              {getFieldDecorator('uName', {
                rules: [
                  { required: true, message: '请输入你的昵称' },
                  { pattern: /^\S+$/, message: '请使用非空字符作为你的昵称' },
                  { max: 10, message: '你的昵称不能超过10个字符' },
                  { min: 2, message: '你的昵称不能少于2个' }
                ],
                initialValue: currentUser.uName
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              {getFieldDecorator('uSex', {
                initialValue: currentUser.uSex
              })(
                <RadioGroup>
                  <Radio value="MALE">男</Radio>
                  <Radio value="FEMALE">女</Radio>
                  <Radio value="OTHER">保密</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="年龄">
              {getFieldDecorator('uAge', {
                rules: [{ required: true, message: '请输入你的年龄' }],
                initialValue: currentUser.uAge
              })(<InputNumber min={1} max={100} style={{ width: '100%' }} precision={0.1} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="更改头像">
              <Upload className={styles['avatar-uploader']} name="avatar" showUploadList={false} action="//jsonplaceholder.typicode.com/posts/" beforeUpload={this.beforeUpload}>
                {imageUrl ? <img src={imageUrl} alt="" className={styles.avatar} /> : <Icon type="plus" className={styles['avatar-uploader-trigger']} />}
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label="个人简介" hasFeedback>
              {getFieldDecorator('uDescribe', { initialValue: currentUser.uDescribe })(<TextArea placeholder="SHOW出你自己吧～" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 40 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                确认修改
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

export default EditMyInfo;
