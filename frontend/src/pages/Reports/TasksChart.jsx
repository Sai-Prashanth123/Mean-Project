import { useEffect, useState } from 'react';
import { Spin, Empty, Row, Col, Typography } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { request } from '@/request';

const STATUS_COLORS = { pending: '#1890ff', completed: '#52c41a', overdue: '#f5222d' };
const TYPE_COLORS = ['#1890ff', '#13c2c2', '#722ed1', '#fa8c16', '#8c8c8c'];

export default function TasksChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get({ entity: 'analytics/tasks' }).then((res) => {
      setData(res?.result || null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  if (!data) return <Empty description="No task data yet" />;

  return (
    <Row gutter={24}>
      <Col span={12}>
        <Typography.Title level={5}>Tasks by Status</Typography.Title>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label={(e) => e.status}>
              {(data.byStatus || []).map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Col>
      <Col span={12}>
        <Typography.Title level={5}>Tasks by Type</Typography.Title>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.byType} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" tickFormatter={(v) => v?.replace('_', ' ')} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Tasks">
              {(data.byType || []).map((_, i) => (
                <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
}
