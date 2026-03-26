import { useEffect, useState } from 'react';
import { Button, Tag, Typography, Space, Spin, Tooltip, Popconfirm } from 'antd';
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { request } from '@/request';
import DealModal from './DealModal';

const STAGES = [
  { key: 'lead', label: 'Lead', color: 'blue' },
  { key: 'contacted', label: 'Contacted', color: 'cyan' },
  { key: 'proposal', label: 'Proposal', color: 'gold' },
  { key: 'negotiation', label: 'Negotiation', color: 'orange' },
  { key: 'won', label: 'Won', color: 'green' },
  { key: 'lost', label: 'Lost', color: 'red' },
];

const STAGE_KEYS = STAGES.map((s) => s.key);

const fmt = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`;

export default function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadDeals = () => {
    setLoading(true);
    request.listAll({ entity: 'deal' }).then((res) => {
      setDeals(res?.result || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDeals();
    request.listAll({ entity: 'client' }).then((res) => setClients(res?.result || []));
  }, []);

  const dealsByStage = (stage) => deals.filter((d) => d.stage === stage);

  const stageTotal = (stage) =>
    dealsByStage(stage).reduce((sum, d) => sum + (d.value || 0), 0);

  const moveStage = async (deal, direction) => {
    const idx = STAGE_KEYS.indexOf(deal.stage);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= STAGE_KEYS.length) return;
    await request.patch({
      entity: `deal/moveStage/${deal._id}`,
      jsonData: { stage: STAGE_KEYS[newIdx] },
    });
    loadDeals();
  };

  const handleSave = async (values) => {
    setSaving(true);
    if (editing) {
      await request.update({ entity: 'deal', id: editing._id, jsonData: values });
    } else {
      await request.create({ entity: 'deal', jsonData: values });
    }
    setSaving(false);
    setModalOpen(false);
    loadDeals();
  };

  const handleDelete = async (id) => {
    await request.delete({ entity: 'deal', id });
    loadDeals();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, color: '#22075e' }}>
            <ProjectOutlined style={{ marginRight: 10, color: '#1890ff' }} />
            Sales Pipeline
          </Typography.Title>
          <Typography.Text type="secondary">Track deals through your sales stages</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setModalOpen(true); }}>
          Add Deal
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
          {STAGES.map((stage, stageIdx) => {
            const stageDeals = dealsByStage(stage.key);
            return (
              <div
                key={stage.key}
                style={{
                  minWidth: 240,
                  flex: '0 0 240px',
                  background: '#f5f5f5',
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Tag color={stage.color} style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>
                    {stage.label}
                  </Tag>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {stageDeals.length} · {fmt(stageTotal(stage.key))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stageDeals.map((deal) => (
                    <div
                      key={deal._id}
                      style={{
                        background: '#fff',
                        borderRadius: 6,
                        padding: '10px 12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{deal.title}</div>
                      {deal.client?.name && (
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{deal.client.name}</div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <Tag color="blue" style={{ margin: 0, fontSize: 12 }}>{fmt(deal.value || 0)}</Tag>
                        <Space size={2}>
                          <Tooltip title="Move left">
                            <Button
                              size="small"
                              icon={<LeftOutlined />}
                              disabled={stageIdx === 0}
                              onClick={() => moveStage(deal, -1)}
                            />
                          </Tooltip>
                          <Tooltip title="Move right">
                            <Button
                              size="small"
                              icon={<RightOutlined />}
                              disabled={stageIdx === STAGES.length - 1}
                              onClick={() => moveStage(deal, 1)}
                            />
                          </Tooltip>
                          <Tooltip title="Edit">
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => { setEditing(deal); setModalOpen(true); }}
                            />
                          </Tooltip>
                          <Popconfirm title="Delete this deal?" onConfirm={() => handleDelete(deal._id)} okText="Yes" cancelText="No">
                            <Button size="small" icon={<DeleteOutlined />} danger />
                          </Popconfirm>
                        </Space>
                      </div>
                      {deal.expectedCloseDate && (
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
                          Close: {new Date(deal.expectedCloseDate).toLocaleDateString('en-IN')}
                        </div>
                      )}
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#ccc', padding: '20px 0', fontSize: 12 }}>
                      No deals
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DealModal
        open={modalOpen}
        editing={editing}
        clients={clients}
        saving={saving}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
