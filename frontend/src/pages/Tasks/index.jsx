import { useEffect, useState } from 'react';
import {
  Table, Button, Tag, Space, Typography, Popconfirm, Alert, Statistic, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined,
  PhoneOutlined, MailOutlined, TeamOutlined, BellOutlined, CheckSquareOutlined,
} from '@ant-design/icons';
import { request } from '@/request';
import TaskModal from './TaskModal';

const PRIORITY_COLORS = { low: 'green', medium: 'blue', high: 'orange', urgent: 'red' };
const STATUS_COLORS = { pending: 'blue', completed: 'green', overdue: 'red' };
const TYPE_ICONS = {
  call: <PhoneOutlined />, email: <MailOutlined />, meeting: <TeamOutlined />,
  follow_up: <BellOutlined />, other: <CheckOutlined />,
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ overdue: 0, pending: 0, dueToday: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadTasks = () => {
    setLoading(true);
    Promise.all([
      request.listAll({ entity: 'task' }),
      request.get({ entity: 'task/overdueCount' }),
    ]).then(([tasksRes, countsRes]) => {
      setTasks(tasksRes?.result || []);
      setCounts(countsRes?.result || { overdue: 0, pending: 0, dueToday: 0 });
      setLoading(false);
    });
  };

  useEffect(() => { loadTasks(); }, []);

  const handleSave = async (values) => {
    setSaving(true);
    if (editing) {
      await request.update({ entity: 'task', id: editing._id, jsonData: values });
    } else {
      await request.create({ entity: 'task', jsonData: values });
    }
    setSaving(false);
    setModalOpen(false);
    loadTasks();
  };

  const handleDelete = async (id) => {
    await request.delete({ entity: 'task', id });
    loadTasks();
  };

  const handleComplete = async (id) => {
    await request.patch({ entity: `task/complete/${id}`, jsonData: {} });
    loadTasks();
  };

  const now = new Date();
  const isOverdue = (task) => task.status === 'overdue' || (task.status === 'pending' && new Date(task.dueDate) < now);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          {r.description && <div style={{ fontSize: 12, color: '#888' }}>{r.description}</div>}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (v) => (
        <Space size={4}>
          {TYPE_ICONS[v]}
          <span style={{ fontSize: 12 }}>{(v || '').replace('_', ' ')}</span>
        </Space>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (v, r) => (
        <span style={{ color: isOverdue(r) ? '#f5222d' : 'inherit', fontWeight: isOverdue(r) ? 600 : 400 }}>
          {v ? new Date(v).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
        </span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (v) => <Tag color={PRIORITY_COLORS[v] || 'default'}>{v}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v) => <Tag color={STATUS_COLORS[v] || 'default'}>{v}</Tag>,
    },
    {
      title: 'Actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          {record.status !== 'completed' && (
            <Button
              size="small"
              type="primary"
              ghost
              icon={<CheckOutlined />}
              onClick={() => handleComplete(record._id)}
            >
              Complete
            </Button>
          )}
          <Button size="small" icon={<EditOutlined />} onClick={() => { setEditing(record); setModalOpen(true); }} />
          <Popconfirm title="Delete this task?" onConfirm={() => handleDelete(record._id)} okText="Yes" cancelText="No">
            <Button size="small" icon={<DeleteOutlined />} danger />
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
            <CheckSquareOutlined style={{ marginRight: 10, color: '#1890ff' }} />
            Tasks & Follow-ups
          </Typography.Title>
          <Typography.Text type="secondary">Manage your sales tasks and reminders</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setModalOpen(true); }}>
          Add Task
        </Button>
      </div>

      {counts.overdue > 0 && (
        <Alert
          type="error"
          showIcon
          message={`${counts.overdue} overdue task${counts.overdue > 1 ? 's' : ''} require your attention`}
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <div className="whiteBox shadow" style={{ textAlign: 'center', padding: '16px 0' }}>
            <Statistic title="Overdue" value={counts.overdue} valueStyle={{ color: '#f5222d' }} />
          </div>
        </Col>
        <Col span={8}>
          <div className="whiteBox shadow" style={{ textAlign: 'center', padding: '16px 0' }}>
            <Statistic title="Due Today" value={counts.dueToday} valueStyle={{ color: '#fa8c16' }} />
          </div>
        </Col>
        <Col span={8}>
          <div className="whiteBox shadow" style={{ textAlign: 'center', padding: '16px 0' }}>
            <Statistic title="Pending" value={counts.pending} valueStyle={{ color: '#1890ff' }} />
          </div>
        </Col>
      </Row>

      <div className="whiteBox shadow" style={{ padding: 0 }}>
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowClassName={(r) => isOverdue(r) ? 'overdue-row' : ''}
        />
      </div>

      <TaskModal
        open={modalOpen}
        editing={editing}
        saving={saving}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
      />

      <style>{`.overdue-row td { background: #fff1f0 !important; }`}</style>
    </div>
  );
}
