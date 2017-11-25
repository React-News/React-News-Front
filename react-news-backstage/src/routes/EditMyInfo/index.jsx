import React, { PureComponent } from 'react';
import { Form, Input, Button, Card, Radio, InputNumber, Upload, message, Icon } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}
@Form.create()
class BasicForms extends PureComponent {
  state = {
    confirmDirty: false
  };
  handleChange = (info) => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        delete values.confirm;
        console.log(values);
      } else {
        console.log(err);
      }
    });
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('uPasswd')) {
      callback('你两次输入的密码需要保持一致');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

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
                rules: [{ required: true, message: '请输入你的昵称' }, { pattern: /^\S+$/, message: '请使用非空字符作为你的昵称' }]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              {getFieldDecorator('uSex')(
                <RadioGroup>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                  <Radio value="other">保密</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="年龄">
              {getFieldDecorator('uAge', {
                rules: [{ required: true, message: '请输入你的年龄' }]
              })(<InputNumber min={1} max={100} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="更改头像">
              <div>
                {getFieldDecorator('nImg', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile
                })(
                  <Upload
                    className={styles['avatar-uploader']}
                    name="avatar"
                    showUploadList={false}
                    action="//jsonplaceholder.typicode.com/posts/"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="" className="avatar" /> : <Icon type="plus" className={styles['avatar-uploader-trigger']} />}
                  </Upload>
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="个人简介" hasFeedback>
              {getFieldDecorator('uDescribe')(<TextArea placeholder="SHOW出你自己吧～" />)}
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

export default BasicForms;
