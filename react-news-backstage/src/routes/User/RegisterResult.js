import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';
@connect(state => ({
  register: state.register
}))
export default class RegisterResult extends React.Component {
  componentDidMount() {
    console.log(this.props.register);
  }
  render() {
    const title = <div className={styles.title}>你的账户：{this.props.register.userData.uTelNum} 注册成功</div>;
    const actions = (
      <div className={styles.actions}>
        <Link to="/edit-my-info">
          <Button size="large" type="primary">
            完善信息
          </Button>
        </Link>
        <Link to="/">
          <Button size="large">进入首页</Button>
        </Link>
      </div>
    );
    return <Result className={styles.registerResult} type="success" title={title} description="恭喜你注册成功，接下来去完善一下信息吧～" actions={actions} style={{ marginTop: 56 }} />;
  }
}
