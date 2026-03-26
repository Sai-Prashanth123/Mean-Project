import { useEffect, useState } from 'react';
import { Spin, Typography } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { request } from '@/request';

export default function RevenueChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get({ entity: 'invoice/revenueChart' }).then((res) => {
      if (res?.success) setData(res.result);
      setLoading(false);
    });
  }, []);

  return (
    <div className="whiteBox shadow" style={{ padding: '20px 20px 10px' }}>
      <Typography.Title level={5} style={{ color: '#22075e', marginBottom: 16 }}>
        Monthly Revenue (Last 6 Months)
      </Typography.Title>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220 }}>
          <Spin />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'revenue' ? 'Total Invoiced' : 'Collected']}
            />
            <Legend />
            <Bar dataKey="revenue" name="Total Invoiced" fill="#1890ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="paid" name="Collected" fill="#52c41a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
