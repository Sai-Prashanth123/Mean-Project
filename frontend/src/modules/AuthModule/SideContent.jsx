import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <Title level={1} style={{ fontSize: 36, margin: '0 0 40px' }}>
          NexaCRM
        </Title>

        <Title level={3} style={{ fontSize: 22 }}>
          ERP / CRM Solution
        </Title>
        <Text>
          Invoicing / Payments / Quotes built on Node.js React.js Ant Design
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
