import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Tag,
  Space,
  Popconfirm,
  Typography,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  WalletOutlined,
  StarFilled,
} from '@ant-design/icons';
import { request } from '@/request';

export default function PaymentMode() {
  const [modes, setModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    request.listAll({ entity: 'paymentmode' }).then((res) => {
      setModes(res?.result || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ enabled: true, isDefault: false });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    if (editing) {
      await request.update({ entity: 'paymentmode', id: editing._id, jsonData: values });
    } else {
      await request.create({ entity: 'paymentmode', jsonData: values });
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    await request.delete({ entity: 'paymentmode', id });
    load();
  };

  const columns = [
    {
      title: 'Payment Mode',
      dataIndex: 'name',
      render: (name, record) => (
        <Space>
          <WalletOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.isDefault && (
            <Tag color="gold" icon={<StarFilled />}>Default</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (v) => <span style={{ color: '#666' }}>{v || '—'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      render: (v) => <Tag color={v ? 'green' : 'default'}>{v ? 'Active' : 'Disabled'}</Tag>,
    },
    {
      title: 'Actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this payment mode?" onConfirm={() => handleDelete(record._id)} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, color: '#22075e' }}>
            <WalletOutlined style={{ marginRight: 10, color: '#1890ff' }} />
            Payment Modes
          </Typography.Title>
          <Typography.Text type="secondary">Manage accepted payment methods</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Payment Mode
        </Button>
      </div>

      <div className="whiteBox shadow" style={{ padding: 0 }}>
        <Table
          dataSource={modes}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={false}
        />
      </div>

      <Modal
        title={editing ? 'Edit Payment Mode' : 'Add Payment Mode'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText={editing ? 'Save Changes' : 'Add'}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="e.g. Bank Transfer, UPI, Cash" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional description" />
          </Form.Item>
          <Form.Item name="isDefault" label="Set as Default" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="enabled" label="Active" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
