import { useEffect, useState } from 'react';
import { Alert, Button } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { request } from '@/request';

export default function OverdueAlert() {
  const [overdueCount, setOverdueCount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    request.summary({ entity: 'invoice' }).then((res) => {
      if (res?.result?.performance) {
        const overdue = res.result.performance.find((p) => p.status === 'overdue');
        if (overdue) {
          setOverdueCount(overdue.count || 0);
        }
      }
      if (res?.result?.total_undue) {
        setOverdueAmount(res.result.total_undue);
      }
    });
  }, []);

  if (overdueCount === 0) return null;

  return (
    <Alert
      icon={<WarningOutlined />}
      showIcon
      type="warning"
      message={
        <span>
          <strong>{overdueCount} overdue invoice{overdueCount > 1 ? 's' : ''}</strong>
          {' — '}${overdueAmount?.toLocaleString()} pending collection.
        </span>
      }
      action={
        <Button size="small" type="link" onClick={() => navigate('/invoice')}>
          View Invoices
        </Button>
      }
      style={{ marginBottom: 16 }}
    />
  );
}
