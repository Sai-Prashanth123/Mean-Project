import { useEffect, useState } from 'react';
import {
  Table, Button, Tag, Space, Progress, Popconfirm, Typography, Select, Input, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { request } from '@/request';
import LeadModal from './LeadModal';

const SOURCE_COLORS = {
  website: 'blue', referral: 'purple', cold_call: 'orange',
  email: 'geekblue', social: 'magenta', other: 'default',
};
const STATUS_COLORS = {
  new: 'blue', contacted: 'cyan', qualified: 'gold', converted: 'green', lost: 'red',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sourceFilter, setSourceFilter] = useState(null);
  const [search, setSearch] = useState('');

  const loadLeads = () => {
    setLoading(true);
    request.listAll({ entity: 'lead' }).then((res) => {
      const data = res?.result || [];
      setLeads(data);
      setFiltered(data);
      setLoading(false);
    });
  };

  useEffect(() => { loadLeads(); }, []);

  useEffect(() => {
    let data = [...leads];
    if (statusFilter) data = data.filter((l) => l.status === statusFilter);
    if (sourceFilter) data = data.filter((l) => l.source === sourceFilter);
    if (search) data = data.filter((l) => l.name?.toLowerCase().includes(search.toLowerCase()) || l.company?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(data);
  }, [statusFilter, sourceFilter, search, leads]);

  const handleSave = async (values) => {
    setSaving(true);
    if (editing) {
      await request.update({ entity: 'lead', id: editing._id, jsonData: values });
    } else {
      await request.create({ entity: 'lead', jsonData: values });
    }
    setSaving(false);
    setModalOpen(false);
    loadLeads();
  };

  const handleDelete = async (id) => {
    await request.delete({ entity: 'lead', id });
    loadLeads();
  };

  const handleConvert = async (lead) => {
    await request.patch({ entity: `lead/convert/${lead._id}`, jsonData: {} });
    loadLeads();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          {r.company && <div style={{ fontSize: 12, color: '#888' }}>{r.company}</div>}
        </div>
      ),
    },
    {
      title: 'Contact',
      render: (_, r) => (
        <div style={{ fontSize: 12 }}>
          {r.email && <div>{r.email}</div>}
          {r.phone && <div style={{ color: '#888' }}>{r.phone}</div>}
        </div>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      render: (v) => <Tag color={SOURCE_COLORS[v] || 'default'}>{(v || '').replace('_', ' ')}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v) => <Tag color={STATUS_COLORS[v] || 'default'}>{v}</Tag>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      width: 140,
      render: (v) => (
        <Progress
          percent={v}
          size="small"
          strokeColor={v >= 70 ? '#52c41a' : v >= 40 ? '#fa8c16' : '#f5222d'}
          format={(p) => `${p}`}
        />
      ),
    },
    {
      title: 'Actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title={record.status === 'converted' ? 'Already converted' : 'Convert to Client'}>
            <Button
              icon={<CheckCircleOutlined />}
              size="small"
              type="primary"
              ghost
              disabled={record.status === 'converted'}
              onClick={() => handleConvert(record)}
            >
              Convert
            </Button>
          </Tooltip>
          <Button icon={<EditOutlined />} size="small" onClick={() => { setEditing(record); setModalOpen(true); }} />
          <Popconfirm title="Delete this lead?" onConfirm={() => handleDelete(record._id)} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} size="small" danger />
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
            <TeamOutlined style={{ marginRight: 10, color: '#1890ff' }} />
            Lead Management
          </Typography.Title>
          <Typography.Text type="secondary">Track and qualify your sales prospects</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setModalOpen(true); }}>
          Add Lead
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by name or company"
          style={{ width: 260 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          style={{ width: 160 }}
          allowClear
          onChange={setStatusFilter}
          options={['new','contacted','qualified','converted','lost'].map((v) => ({ value: v, label: v }))}
        />
        <Select
          placeholder="Filter by source"
          style={{ width: 160 }}
          allowClear
          onChange={setSourceFilter}
          options={['website','referral','cold_call','email','social','other'].map((v) => ({ value: v, label: v.replace('_',' ') }))}
        />
      </div>

      <div className="whiteBox shadow" style={{ padding: 0 }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <LeadModal
        open={modalOpen}
        editing={editing}
        saving={saving}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
