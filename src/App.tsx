import { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  theme,
} from 'antd';
import {
  UnorderedListOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import ContentPool from './pages/ContentPool';
import Waterfall from './pages/Waterfall';
import AdSlotMgmt from './pages/AdSlotMgmt';
import ABTestReport from './pages/ABTestReport';
import DataReport from './pages/DataReport';
import HourlyReport from './pages/HourlyReport';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];



function App() {
  const [collapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('adx-traffic-group');
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: '个人中心' },
    { key: 'settings', label: '账号设置' },
    { key: 'logout', label: '退出登录' },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'traffic') {
      setSelectedMenuKey('adx-traffic-group');
    } else {
      setSelectedMenuKey(e.key);
    }
  };

  const renderContent = () => {
    switch (selectedMenuKey) {
      case 'adx-traffic-group':
        return <Waterfall />;
      case 'ad-slot-mgmt':
        return <AdSlotMgmt />;
      case 'dynamic-pool':
        return <ContentPool />;
      case 'ab-test-report':
        return <ABTestReport />;
      case 'data-report':
        return <DataReport />;
      case 'hourly-report':
        return <HourlyReport />;
      case 'ssp':
        return (
          <div style={{ textAlign: 'center', padding: '120px 0', color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <div style={{ fontSize: 16 }}>SSP系统功能开发中，敬请期待</div>
          </div>
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: '120px 0', color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <div style={{ fontSize: 16 }}>页面建设中</div>
          </div>
        );
    }
  };

  const [openKeys, setOpenKeys] = useState<string[]>(['traffic']);

  const menuItems: MenuItem[] = [
    {
      key: 'ad-interaction',
      icon: <UnorderedListOutlined />,
      label: '广告交互管理',
    },
    {
      key: 'brand',
      icon: <UnorderedListOutlined />,
      label: '品牌管理',
    },
    {
      key: 'brand-tool',
      icon: <UnorderedListOutlined />,
      label: '品牌小工具',
    },
    {
      key: 'youplus',
      icon: <UnorderedListOutlined />,
      label: '柚+管理',
    },
    {
      key: 'women-channel',
      icon: <UnorderedListOutlined />,
      label: '女人通管理',
    },
    {
      key: 'women-channel-cost',
      icon: <UnorderedListOutlined />,
      label: '女人通消费管理',
    },
    {
      key: 'women-channel-data',
      icon: <UnorderedListOutlined />,
      label: '女人通数据管理',
    },
    {
      key: 'media-data',
      icon: <UnorderedListOutlined />,
      label: '媒体数据管理',
    },
    {
      key: 'dsp-data',
      icon: <UnorderedListOutlined />,
      label: 'DSP数据管理',
    },
    {
      key: 'marketing-api',
      icon: <UnorderedListOutlined />,
      label: 'MARKETING API管理',
    },
    {
      key: 'third-party-dmp',
      icon: <UnorderedListOutlined />,
      label: '第三方DMP管理',
    },
    {
      key: 'tools',
      icon: <UnorderedListOutlined />,
      label: '小工具',
    },
    {
      key: 'traffic',
      icon: <UnorderedListOutlined />,
      label: (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMenuKey('adx-traffic-group');
          }}
          style={{ cursor: 'pointer' }}
        >
          ADX流量工具
        </span>
      ),
      children: [
        { key: 'adx-traffic-group', label: '流量分组管理' },
        { key: 'ad-slot-mgmt', label: '代码位ID管理' },
        { key: 'data-report', label: '综合报表' },
        { key: 'hourly-report', label: '分小时报表' },
        { key: 'ab-test-report', label: 'A/B测试报表' },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          zIndex: 10,
        }}
      >
        <div className="logo">
          <div className="logo-icon">
            <span role="img" aria-label="community" style={{ fontSize: 24 }}>
              🏘️
            </span>
          </div>
          {!collapsed && (
            <Text strong style={{ fontSize: 16, color: '#1890ff', whiteSpace: 'nowrap' }}>
              广告投放运营后台
            </Text>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          openKeys={openKeys}
          items={menuItems}
          style={{ borderRight: 0 }}
          onClick={handleMenuClick}
          onOpenChange={setOpenKeys}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            zIndex: 9,
          }}
        >
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: colorPrimary }}
              />
              <Text>张家敏</Text>
              <DownOutlined style={{ fontSize: 12, color: '#999' }} />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 16,
            padding: 16,
            background: colorBgContainer,
            borderRadius: 8,
            overflow: 'auto',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
