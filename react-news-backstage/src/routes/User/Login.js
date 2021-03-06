import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Tabs, Button, Icon, Checkbox, Alert } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({
  login: state.login
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    type: 'account'
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.login.status === '200') {
      this.props.dispatch(routerRedux.push('/'));
    }
  }

  onSwitch = key => {
    this.setState({
      type: key
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        console.log(values);
        this.props.dispatch({
          type: `login/submit`,
          payload: values
        });
      }
    });
  };

  renderMessage = message => {
    return <Alert style={{ marginBottom: 24 }} message={message} type="error" showIcon />;
  };

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="账户密码登录" key="account">
              {login.status === '400' && login.submitting === false && this.renderMessage('账户或密码错误')}
              <FormItem>
                {getFieldDecorator('uTelNum', {
                  rules: [
                    {
                      required: type === 'account',
                      message: '请输入你的手机号'
                    }
                  ]
                })(<Input size="large" prefix={<Icon type="mobile" className={styles.prefixIcon} />} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('uPasswd', {
                  rules: [
                    {
                      required: type === 'account',
                      message: '请输入密码！'
                    }
                  ]
                })(<Input size="large" prefix={<Icon type="lock" className={styles.prefixIcon} />} type="password" />)}
              </FormItem>
            </TabPane>
          </Tabs>
          <FormItem className={styles.additional}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true
            })(<Checkbox className={styles.autoLogin}>自动登录</Checkbox>)}
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
