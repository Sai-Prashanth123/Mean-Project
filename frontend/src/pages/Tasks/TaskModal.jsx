import { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'other', label: 'Other' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

const ENTITIES = [
  { value: 'client', label: 'Client' },
  { value: 'lead', label: 'Lead' },
  { value: 'deal', label: 'Deal' },
];

export default function TaskModal({ open, editing, saving, onOk, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          ...editing,
          dueDate: editing.dueDate ? dayjs(editing.dueDate) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ priority: 'medium', status: 'pending', type: 'other' });
      }
    }
  }, [open, editing]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };

  return (
    <Modal
      title={editing ? 'Edit Task' : 'New Task'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={saving}
      okText={editing ? 'Save' : 'Create'}
      width={480}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="title" label="Task Title" rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="e.g. Follow up with client" />
        </Form.Item>
        <Form.Item name="type" label="Type">
          <Select options={TYPES} />
        </Form.Item>
        <Form.Item name="priority" label="Priority">
          <Select options={PRIORITIES} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={STATUSES} />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Due date is required' }]}>
          <DatePicker style={{ width: '100%' }} showTime />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="linkedEntity" label="Linked To">
          <Select options={ENTITIES} allowClear placeholder="Link to client/lead/deal" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
