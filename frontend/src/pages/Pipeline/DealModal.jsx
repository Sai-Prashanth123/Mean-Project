import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';

const STAGES = [
  { value: 'lead', label: 'Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export default function DealModal({ open, editing, clients, saving, onOk, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          ...editing,
          client: editing.client?._id || editing.client,
          expectedCloseDate: editing.expectedCloseDate ? dayjs(editing.expectedCloseDate) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ stage: 'lead', probability: 10, value: 0 });
      }
    }
  }, [open, editing]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };

  return (
    <Modal
      title={editing ? 'Edit Deal' : 'New Deal'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={saving}
      okText={editing ? 'Save' : 'Create'}
      width={520}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="title" label="Deal Title" rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="e.g. Website Redesign Project" />
        </Form.Item>
        <Form.Item name="client" label="Client">
          <Select
            showSearch
            placeholder="Select client"
            optionFilterProp="label"
            options={clients.map((c) => ({ value: c._id, label: c.name }))}
            allowClear
          />
        </Form.Item>
        <Form.Item name="value" label="Deal Value (₹)">
          <InputNumber min={0} style={{ width: '100%' }} formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v.replace(/₹\s?|(,*)/g, '')} />
        </Form.Item>
        <Form.Item name="stage" label="Stage">
          <Select options={STAGES} />
        </Form.Item>
        <Form.Item name="probability" label="Win Probability (%)">
          <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
        </Form.Item>
        <Form.Item name="expectedCloseDate" label="Expected Close Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
