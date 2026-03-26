import { useEffect, useState } from 'react';
import { Spin, Empty, Row, Col, Typography } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { request } from '@/request';

const SOURCE_COLORS = ['#1890ff', '#722ed1', '#fa8c16', '#13c2c2', '#eb2f96', '#8c8c8c'];
const STATUS_COLORS = { new: '#1890ff', contacted: '#13c2c2', qualified: '#fadb14', converted: '#52c41a', lost: '#f5222d' };

export default function LeadsChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get({ entity: 'analytics/leads' }).then((res) => {
      setData(res?.result || null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  if (!data) return <Empty description="No lead data yet" />;

  return (
    <Row gutter={24}>
      <Col span={12}>
        <Typography.Title level={5}>Leads by Source</Typography.Title>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.bySource} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={90} label={(e) => e.source?.replace('_', ' ')}>
              {(data.bySource || []).map((_, i) => (
                <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Col>
      <Col span={12}>
        <Typography.Title level={5}>Leads by Status</Typography.Title>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.byStatus} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Leads">
              {(data.byStatus || []).map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
}
