import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Button, Input, Typography, Empty, Divider } from 'antd';
import { SendOutlined, FileTextOutlined } from '@ant-design/icons';
import { request } from '@/request';
import { selectCurrentItem } from '@/redux/crud/selectors';

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function ClientNotesPanel() {
  const currentItem = useSelector(selectCurrentItem);
  const clientId = currentItem?.result?._id;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const loadNotes = () => {
    if (!clientId) return;
    setLoading(true);
    request.get({ entity: `note/byEntity?entity=client&id=${clientId}` }).then((res) => {
      setNotes(res?.result || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadNotes();
  }, [clientId]);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    await request.create({
      entity: 'note',
      jsonData: { content: newNote.trim(), linkedEntity: 'client', linkedId: clientId },
    });
    setNewNote('');
    setSaving(false);
    loadNotes();
  };

  if (!clientId) return null;

  return (
    <div
      className="whiteBox shadow"
      style={{ padding: 24, marginTop: 16 }}
    >
      <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
        <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
        Client Notes
      </Typography.Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
      ) : notes.length === 0 ? (
        <Empty description="No notes yet" imageStyle={{ height: 40 }} />
      ) : (
        <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 16 }}>
          {notes.map((note) => (
            <div key={note._id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {note.createdBy?.name} {note.createdBy?.surname}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {timeAgo(note.created)}
                </Typography.Text>
              </div>
              <div style={{ background: '#f9f9f9', borderRadius: 6, padding: '8px 12px', fontSize: 13 }}>
                {note.content}
              </div>
              <Divider style={{ margin: '8px 0' }} />
            </div>
          ))}
        </div>
      )}

      <Input.TextArea
        rows={2}
        placeholder="Add a note..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) handleAdd();
        }}
        style={{ marginBottom: 8 }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleAdd}
        loading={saving}
        disabled={!newNote.trim()}
      >
        Add Note
      </Button>
    </div>
  );
}
