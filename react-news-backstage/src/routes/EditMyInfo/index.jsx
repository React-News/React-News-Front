import React, { PureComponent } from 'react';
import { Form, Input, Button, Card, Radio, InputNumber } from 'antd';
import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

@Form.create()
class BasicForms extends PureComponent {
  state = {
    confirmDirty: false
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        delete values.confirm
        console.log(values)
      } else {
        console.log(err)
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
    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 24 }}>
            <FormItem {...formItemLayout} label="手机号" hasFeedback>
              {getFieldDecorator('uTelNum', {
                rules: [{ required: true, message: '请输入你的手机号' }, { pattern: /^[0-9]+$/, message: '请输入数字的组合' }]
              })(<Input placeholder="请输入你的手机号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="用户名" hasFeedback>
              {getFieldDecorator('uName', {
                rules: [{ required: true, message: '请输入用户名' }, { pattern: /^\S+$/, message: '请使用非空字符作为用户名' }]
              })(<Input placeholder="张三" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码" hasFeedback>
              {getFieldDecorator('uPasswd', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码'
                  },
                  {
                    validator: this.checkConfirm
                  }
                ]
              })(<Input type="password" placeholder="Password" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码验证" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请再次输入相同的密码'
                  },
                  {
                    validator: this.checkPassword
                  }
                ]
              })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
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
