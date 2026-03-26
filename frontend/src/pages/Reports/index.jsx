import { Tabs, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import PipelineChart from './PipelineChart';
import LeadsChart from './LeadsChart';
import TasksChart from './TasksChart';
import RevenueChart from '@/modules/DashboardModule/components/RevenueChart';

export default function Reports() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={3} style={{ margin: 0, color: '#22075e' }}>
          <BarChartOutlined style={{ marginRight: 10, color: '#1890ff' }} />
          Analytics & Reports
        </Typography.Title>
        <Typography.Text type="secondary">Business intelligence across your CRM data</Typography.Text>
      </div>

      <div className="whiteBox shadow" style={{ padding: 24 }}>
        <Tabs
          defaultActiveKey="pipeline"
          items={[
            {
              key: 'pipeline',
              label: 'Pipeline',
              children: <PipelineChart />,
            },
            {
              key: 'leads',
              label: 'Leads',
              children: <LeadsChart />,
            },
            {
              key: 'tasks',
              label: 'Tasks',
              children: <TasksChart />,
            },
            {
              key: 'revenue',
              label: 'Revenue',
              children: (
                <div>
                  <Typography.Title level={5}>Monthly Revenue</Typography.Title>
                  <RevenueChart />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
