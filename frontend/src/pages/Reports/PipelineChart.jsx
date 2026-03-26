import { useEffect, useState } from 'react';
import { Spin, Empty, Row, Col, Typography } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { request } from '@/request';

const STAGE_COLORS = {
  lead: '#1890ff', contacted: '#13c2c2', proposal: '#fadb14',
  negotiation: '#fa8c16', won: '#52c41a', lost: '#f5222d',
};

const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`;

export default function PipelineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get({ entity: 'analytics/pipeline' }).then((res) => {
      setData(res?.result || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  if (!data.length) return <Empty description="No pipeline data yet" />;

  return (
    <Row gutter={24}>
      <Col span={14}>
        <Typography.Title level={5}>Deal Value by Stage</Typography.Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis tickFormatter={fmt} />
            <Tooltip formatter={(v) => fmt(v)} />
            <Bar dataKey="value" name="Value">
              {data.map((entry) => (
                <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] || '#8884d8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Col>
      <Col span={10}>
        <Typography.Title level={5}>Deal Count by Stage</Typography.Title>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="stage" cx="50%" cy="50%" outerRadius={100} label={(e) => e.stage}>
              {data.map((entry) => (
                <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
}
