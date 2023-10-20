import { Form, Input, Modal, message } from "antd";
import React from "react";

type TProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (params: { name: string; activeRule: string }) => void;
};

function CreateApp(props: TProps) {
  const { visible, onClose, onConfirm } = props;
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const { name, activeRule } = await form.validateFields();
      onConfirm({ name, activeRule });
    } catch (error) {
      message.warning("请完善信息");
    }
  };

  return (
    <Modal
      title="新增子应用调试"
      onCancel={onClose}
      visible={visible}
      maskClosable={false}
      onOk={handleSubmit}
    >
      <Form autoComplete="off" form={form}>
        <Form.Item
          label="子应用名称"
          name="name"
          rules={[{ required: true, message: "请输入子应用名称" }]}
        >
          <Input placeholder="一般为子应用工程命名" />
        </Form.Item>
        <Form.Item
          label="子应用激活路由"
          name="activeRule"
          rules={[{ required: true, message: "请输入子应用激活规则" }]}
        >
          <Input placeholder="子应用的激活路由，例如：/zone/home" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default CreateApp;
