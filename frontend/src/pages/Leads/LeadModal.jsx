import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

export default function LeadModal({ open, editing, saving, onOk, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue(editing);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'new', source: 'other', score: 0 });
      }
    }
  }, [open, editing]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };

  return (
    <Modal
      title={editing ? 'Edit Lead' : 'Add New Lead'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={saving}
      okText={editing ? 'Save' : 'Add Lead'}
      width={480}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input placeholder="email@example.com" />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input placeholder="+91 98765 43210" />
        </Form.Item>
        <Form.Item name="company" label="Company">
          <Input placeholder="Company name" />
        </Form.Item>
        <Form.Item name="source" label="Lead Source">
          <Select options={SOURCES} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={STATUSES} />
        </Form.Item>
        <Form.Item name="score" label="Lead Score (0–100)">
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
