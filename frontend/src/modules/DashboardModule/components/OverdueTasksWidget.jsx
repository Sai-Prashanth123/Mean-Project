import { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { request } from '@/request';
import { Link } from 'react-router-dom';

export default function OverdueTasksWidget() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    request.get({ entity: 'task/overdueCount' }).then((res) => {
      setCounts(res?.result || null);
    }).catch(() => {});
  }, []);

  if (!counts || (counts.overdue === 0 && counts.dueToday === 0)) return null;

  const parts = [];
  if (counts.overdue > 0) parts.push(`${counts.overdue} overdue`);
  if (counts.dueToday > 0) parts.push(`${counts.dueToday} due today`);

  return (
    <Alert
      type={counts.overdue > 0 ? 'error' : 'warning'}
      showIcon
      message={
        <span>
          You have {parts.join(' and ')} task{counts.overdue + counts.dueToday > 1 ? 's' : ''}.{' '}
          <Link to="/tasks">View Tasks →</Link>
        </span>
      }
      style={{ marginBottom: 16 }}
    />
  );
}
