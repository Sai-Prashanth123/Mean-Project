import { useState, useRef } from 'react';
import { Input, Dropdown, Typography, Tag, Spin, Empty } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';

const typeIcon = {
  client: <UserOutlined style={{ color: '#722ed1' }} />,
  invoice: <FileTextOutlined style={{ color: '#1890ff' }} />,
  quote: <FileSyncOutlined style={{ color: '#13c2c2' }} />,
  payment: <CreditCardOutlined style={{ color: '#52c41a' }} />,
};

const typeColor = {
  client: 'purple',
  invoice: 'blue',
  quote: 'cyan',
  payment: 'green',
};

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const doSearch = (q) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    const auth = storePersist.get('auth');
    axios
      .get(`${API_BASE_URL}search?q=${encodeURIComponent(q)}`, {
        headers: auth ? { Authorization: `Bearer ${auth.current.token}` } : {},
        withCredentials: true,
      })
      .then((res) => {
        setResults(res.data?.result || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSelect = (path) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    navigate(path);
  };

  const dropdownItems = results.map((r) => ({
    key: `${r.type}-${r.id}`,
    label: (
      <div
        onClick={() => handleSelect(r.path)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', cursor: 'pointer' }}
      >
        <span style={{ fontSize: 16 }}>{typeIcon[r.type]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</div>
          {r.subtitle && <div style={{ fontSize: 11, color: '#888' }}>{r.subtitle}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <Tag color={typeColor[r.type]} style={{ fontSize: 10 }}>{r.type}</Tag>
          {r.amount != null && (
            <div style={{ fontSize: 11, color: '#52c41a', fontWeight: 600 }}>
              ${r.amount?.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    ),
  }));

  const emptyItem = {
    key: 'empty',
    label: loading ? (
      <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No results found" style={{ margin: '8px 0' }} />
    ),
    disabled: true,
  };

  return (
    <Dropdown
      open={open && query.length >= 2}
      onOpenChange={(v) => { if (!v) setOpen(false); }}
      menu={{ items: dropdownItems.length > 0 ? dropdownItems : [emptyItem] }}
      trigger={[]}
      overlayStyle={{ width: 360 }}
    >
      <Input
        prefix={<SearchOutlined style={{ color: '#aaa' }} />}
        placeholder="Search clients, invoices, quotes..."
        value={query}
        onChange={handleChange}
        onFocus={() => { if (query.length >= 2) setOpen(true); }}
        style={{ width: 260, borderRadius: 8 }}
        allowClear
        onClear={() => { setQuery(''); setResults([]); setOpen(false); }}
      />
    </Dropdown>
  );
}
