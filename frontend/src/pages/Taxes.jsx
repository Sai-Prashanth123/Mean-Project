import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Tag,
  Space,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PercentageOutlined,
  StarFilled,
} from '@ant-design/icons';
import { request } from '@/request';

export default function Taxes() {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    request.listAll({ entity: 'taxes' }).then((res) => {
      setTaxes(res?.result || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ enabled: true, isDefault: false, taxValue: 0 });
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
      await request.update({ entity: 'taxes', id: editing._id, jsonData: values });
    } else {
      await request.create({ entity: 'taxes', jsonData: values });
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    await request.delete({ entity: 'taxes', id });
    load();
  };

  const columns = [
    {
      title: 'Tax Name',
      dataIndex: 'taxName',
      render: (name, record) => (
        <Space>
          <PercentageOutlined style={{ color: '#13c2c2' }} />
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.isDefault && <Tag color="gold" icon={<StarFilled />}>Default</Tag>}
        </Space>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'taxValue',
      render: (v) => (
        <Tag color="blue" style={{ fontSize: 14, padding: '2px 10px' }}>
          {v}%
        </Tag>
      ),
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
          <Popconfirm title="Delete this tax?" onConfirm={() => handleDelete(record._id)} okText="Yes" cancelText="No">
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
            <PercentageOutlined style={{ marginRight: 10, color: '#13c2c2' }} />
            Tax Rates
          </Typography.Title>
          <Typography.Text type="secondary">Manage tax rates applied to invoices and quotes</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Tax Rate
        </Button>
      </div>

      <div className="whiteBox shadow" style={{ padding: 0 }}>
        <Table
          dataSource={taxes}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={false}
        />
      </div>

      <Modal
        title={editing ? 'Edit Tax Rate' : 'Add Tax Rate'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText={editing ? 'Save Changes' : 'Add'}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="taxName" label="Tax Name" rules={[{ required: true, message: 'Tax name is required' }]}>
            <Input placeholder="e.g. GST 18%, VAT 5%" />
          </Form.Item>
          <Form.Item name="taxValue" label="Tax Rate (%)" rules={[{ required: true, message: 'Tax rate is required' }]}>
            <InputNumber min={0} max={100} step={0.5} style={{ width: '100%' }} addonAfter="%" />
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
