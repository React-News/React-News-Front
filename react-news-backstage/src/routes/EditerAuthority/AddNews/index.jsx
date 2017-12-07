import React, { PureComponent } from 'react';
import { Form, Input, Upload, Select, Button, Card, Icon, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
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
class AddNews extends PureComponent {
  state = {
    imageUrl: null
  };
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
        let currentUser = this.props.user.currentUser;
        values.nImg = this.state.imageUrl;
        values.uID = currentUser.uID;
        console.log(values);
      }
    });
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
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 24 }}
          >
            <FormItem {...formItemLayout} label="新闻标题" hasFeedback>
              {getFieldDecorator('nTitle', {
                rules: [
                  {
                    required: true,
                    message: '你必须填写此新闻的标题'
                  }
                ]
              })(<Input placeholder="新闻标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新闻类型" hasFeedback>
              {getFieldDecorator('nType', {
                rules: [
                  {
                    required: true,
                    message: '你必须填写此新闻的类型'
                  }
                ]
              })(
                <Select placeholder="新闻类型">
                  <Option value="SPORT">体育</Option>
                  <Option value="TECH">科技</Option>
                  <Option value="SOCIETY">社会</Option>
                  <Option value="FINANCE">财经</Option>
                  <Option value="GAME">游戏</Option>
                  <Option value="CAR">汽车</Option>
                  <Option value="OTHER">其他</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="新闻图片">
              <Upload
                className={styles['avatar-uploader']}
                name="avatar"
                showUploadList={false}
                action="//jsonplaceholder.typicode.com/posts/"
                beforeUpload={this.beforeUpload}
              >
                {this.state.imageUrl ? (
                  <img
                    src={this.state.imageUrl}
                    alt=""
                    className={styles.avatar}
                  />
                ) : (
                  <Icon
                    type="plus"
                    className={styles['avatar-uploader-trigger']}
                  />
                )}
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label="新闻内容" hasFeedback>
              {getFieldDecorator('nContent')(
                <TextArea
                  placeholder="在这里输入此条新闻的文字内容"
                  autosize={{ minRows: 4, maxRows: 1000 }}
                />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 40 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

export default AddNews;
