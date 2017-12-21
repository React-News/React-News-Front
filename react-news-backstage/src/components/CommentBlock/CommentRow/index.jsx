import React, { Component } from 'react';
import { Avatar } from 'antd';
import styles from './index.less';
const BetterAvatar = createrInfo => {
  return createrInfo.uAvatar ? <Avatar size="large" src={createrInfo.uAvatar} /> : <Avatar size="large">{createrInfo.uName[0]}</Avatar>;
};
const restoreListItem = restore => {
  return (
    <div className="restoreListItem" key="restore.rID">
      <div className={styles.avatar}>{BetterAvatar(restore.createrInfo)}</div>
      <div className={styles.right}>
        <div className={styles.createrInfo}>
          <span className={styles.name}>{restore.createrInfo.uName}</span>
        </div>
        <p className={styles.content}>
          {restore.rContent}
        </p>
      </div>
    </div>
  );
};
export default class CommentRow extends Component {
  render() {
    const { list: { createrInfo, pList }, list } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.avatar}>{BetterAvatar(createrInfo)}</div>
        <div className={styles.right}>
          <div className={styles.createrInfo}>
            <span className={styles.name}>{createrInfo.uName}</span>
          </div>
          <p className={styles.content}>{list.rContent}</p>
          <div className={styles.action}>
            <a href="#">回复</a>
          </div>
          <div className={styles.restoreList}>
            {pList.map(item => restoreListItem(item))}
          </div>
        </div>
      </div>
    );
  }
}
