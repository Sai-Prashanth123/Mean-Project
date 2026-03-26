import { useEffect, useState } from 'react';
import { Timeline, Spin, Typography, Tag } from 'antd';
import {
  FileAddOutlined,
  CreditCardOutlined,
  UserAddOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { request } from '@/request';

const typeConfig = {
  invoice_created: { color: '#1890ff', icon: <FileAddOutlined />, tag: 'Invoice', tagColor: 'blue' },
  invoice_updated: { color: '#faad14', icon: <FileAddOutlined />, tag: 'Updated', tagColor: 'gold' },
  payment_received: { color: '#52c41a', icon: <CreditCardOutlined />, tag: 'Payment', tagColor: 'green' },
  client_added: { color: '#722ed1', icon: <UserAddOutlined />, tag: 'Client', tagColor: 'purple' },
  quote_created: { color: '#13c2c2', icon: <FileDoneOutlined />, tag: 'Quote', tagColor: 'cyan' },
  quote_accepted: { color: '#52c41a', icon: <CheckCircleOutlined />, tag: 'Accepted', tagColor: 'green' },
};

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.list({ entity: 'activitylog', options: { limit: 12 } }).then((res) => {
      if (res?.result) setActivities(res.result);
      setLoading(false);
    });
  }, []);

  const items = activities.map((a) => {
    const cfg = typeConfig[a.type] || { color: '#999', tag: a.type, tagColor: 'default' };
    return {
      color: cfg.color,
      dot: cfg.icon,
      children: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div>
            <Tag color={cfg.tagColor} style={{ marginBottom: 2 }}>{cfg.tag}</Tag>
            <span style={{ fontSize: 13, color: '#333' }}>{a.description}</span>
          </div>
          <span style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>{timeAgo(a.created)}</span>
        </div>
      ),
    };
  });

  return (
    <div className="whiteBox shadow" style={{ padding: '20px', height: '100%' }}>
      <Typography.Title level={5} style={{ color: '#22075e', marginBottom: 16 }}>
        Recent Activity
      </Typography.Title>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}><Spin /></div>
      ) : activities.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center' }}>No recent activity</p>
      ) : (
        <Timeline items={items} style={{ maxHeight: 320, overflowY: 'auto' }} />
      )}
    </div>
  );
}
