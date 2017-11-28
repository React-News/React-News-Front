import React, { PureComponent } from 'react';
import { Form, Input, Upload, Select, Button, Card, Icon } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const TextArea = Input.TextArea;

@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
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
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 24 }}>
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
              <div className={styles.dropbox}>
                {getFieldDecorator('nImg', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile
                })(
                  <Upload.Dragger name="nImg" action="/uploadNewsImg">
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或者拖拽图片到这里</p>
                    <p className="ant-upload-hint">目前仅支持上传单张图片</p>
                  </Upload.Dragger>
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="新闻内容" hasFeedback>
              {getFieldDecorator('nContent')(<TextArea placeholder="在这里输入此条新闻的文字内容"  autosize={{ minRows: 4, maxRows: 1000 }}/>)}
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

export default BasicForms;
