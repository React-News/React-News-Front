import React, { Component } from 'react';
import { Avatar } from 'antd';
import styles from './index.less';
export default class CommentRow extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.avatar}>
          <Avatar size="large">U</Avatar>
        </div>
        <div className={styles.right}>
          <div className={styles.createrInfo}>
            <span className={styles.name}>Zeth</span>
          </div>
          <p className={styles.content}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem deserunt vitae pariatur, aspernatur facilis accusamus doloremque illum enim magni animi, expedita nostrum
            cumque est fugiat eius nam, voluptatum quae ipsa.
          </p>
          <div className={styles.action}>
            <a href="#">回复</a>
          </div>
          <div className={styles.restoreList}>
            <div className="restoreListItem">
              <div className={styles.avatar}>
                <Avatar size="large">U</Avatar>
              </div>
              <div className={styles.right}>
                <div className={styles.createrInfo}>
                  <span className={styles.name}>Zeth</span>
                </div>
                <p className={styles.content}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem deserunt vitae pariatur, aspernatur facilis accusamus doloremque illum enim magni animi, expedita
                  nostrum cumque est fugiat eius nam, voluptatum quae ipsa.
                </p>
              </div>
            </div>
            <div className="restoreListItem">
              <div className={styles.avatar}>
                <Avatar size="large">U</Avatar>
              </div>
              <div className={styles.right}>
                <div className={styles.createrInfo}>
                  <span className={styles.name}>Zeth</span>
                </div>
                <p className={styles.content}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem deserunt vitae pariatur, aspernatur facilis accusamus doloremque illum enim magni animi, expedita
                  nostrum cumque est fugiat eius nam, voluptatum quae ipsa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
