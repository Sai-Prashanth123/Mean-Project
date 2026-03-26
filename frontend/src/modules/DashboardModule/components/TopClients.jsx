import { useEffect, useState } from 'react';
import { Spin, Typography, Avatar, Progress, Tooltip } from 'antd';
import { UserOutlined, TrophyOutlined } from '@ant-design/icons';
import { request } from '@/request';

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4096ff', '#4096ff'];

export default function TopClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get({ entity: 'invoice/topClients' }).then((res) => {
      if (res?.success) setClients(res.result);
      setLoading(false);
    });
  }, []);

  const maxRevenue = clients[0]?.totalRevenue || 1;

  return (
    <div className="whiteBox shadow" style={{ padding: '20px', height: '100%' }}>
      <Typography.Title level={5} style={{ color: '#22075e', marginBottom: 16 }}>
        <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
        Top Clients by Revenue
      </Typography.Title>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}><Spin /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {clients.map((client, i) => (
            <div key={client.clientId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar
                size={32}
                style={{ backgroundColor: medalColors[i], flexShrink: 0, fontWeight: 700, fontSize: 14 }}
              >
                {i + 1}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Tooltip title={client.email}>
                    <span style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {client.name || 'Unknown'}
                    </span>
                  </Tooltip>
                  <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 600, marginLeft: 8 }}>
                    ${client.totalRevenue?.toLocaleString()}
                  </span>
                </div>
                <Progress
                  percent={Math.round((client.totalRevenue / maxRevenue) * 100)}
                  showInfo={false}
                  size="small"
                  strokeColor={i === 0 ? '#FFD700' : '#1890ff'}
                  style={{ marginBottom: 0 }}
                />
                <span style={{ fontSize: 11, color: '#999' }}>{client.invoiceCount} invoice{client.invoiceCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
