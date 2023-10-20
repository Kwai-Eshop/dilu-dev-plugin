import { Form, Input, Modal, message } from "antd";
import React from "react";
import { HTTP_REGEXP, REQUEST_DOMAIN } from "../../constant";
import QuestionTooltip from "../QuestionTooltip";

type TProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (entry: string) => void;
  initialValues?: {
    domain: string;
  };
};

function ModifyDomain(props: TProps) {
  const { visible, onCancel, onConfirm, initialValues } = props;
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const { domain } = await form.validateFields();
      onConfirm(domain);
    } catch (error) {
      message.warning("请输入正确的域名");
    }
  };

  const notice = `请输入完整的 HTTP 链接，例如：${REQUEST_DOMAIN}`;
  return (
    <Modal
      title="修改请求域名"
      onCancel={onCancel}
      maskClosable={false}
      visible={visible}
      onOk={handleSubmit}
    >
      <Form autoComplete="off" form={form} initialValues={initialValues}>
        <Form.Item
          label={
            <>
              子应用版本请求域名
              <QuestionTooltip content={notice} />
            </>
          }
          name="domain"
          rules={[
            { required: true, message: "请输入子应用入口" },
            {
              pattern: HTTP_REGEXP,
              message: notice,
            },
          ]}
          extra={`${notice} ${
            initialValues?.domain
              ? `，当前请求域名为${initialValues?.domain}`
              : ""
          }`}
        >
          <Input placeholder={notice} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default ModifyDomain;
