import { Form, Input, Modal, message } from "antd";
import React from "react";
import { HTTP_REGEXP } from "../../constant";
import QuestionTooltip from "../QuestionTooltip";

type TProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (entry: string) => void;
};

function AddEntry(props: TProps) {
  const { visible, onCancel, onConfirm } = props;
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const { entry } = await form.validateFields();
      onConfirm(entry);
    } catch (error) {
      message.warning("请输入正确的入口地址");
    }
  };

  return (
    <Modal
      title="新增子应用入口"
      onCancel={onCancel}
      maskClosable={false}
      visible={visible}
      onOk={handleSubmit}
    >
      <Form autoComplete="off" form={form}>
        <Form.Item
          label={
            <>
              子应用入口
              <QuestionTooltip content="请输入完整的 HTTP 链接，例如：https://dev.staging.xxx.com:9528" />
            </>
          }
          name="entry"
          rules={[
            { required: true, message: "请输入子应用入口" },
            {
              pattern: HTTP_REGEXP,
              message:
                "请输入正确的 HTTP 链接，例如：https://dev.staging.xxx.com:9528",
            },
          ]}
          extra="请输入完整的 HTTP 链接，例如：https://dev.staging.xxx.com:9528"
        >
          <Input placeholder="请输入完整的 HTTP 链接，例如：https://dev.staging.xxx.com:9528" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default AddEntry;
