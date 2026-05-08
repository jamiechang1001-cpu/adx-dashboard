import React, { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Tooltip,
  Modal,
  message,
} from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  UpOutlined,
  FileTextOutlined,
  CopyOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface ContentPoolItem {
  id: number;
  name: string;
  status: string;
  category: string;
  contentType: string;
  activeCount: number;
  pendingCount: number;
  createTime: string;
  creator: string;
  operateTime: string;
  operator: string;
}

const statusMap: Record<string, { color: string; text: string }> = {
  active: { color: 'green', text: '生效中' },
  pending: { color: 'orange', text: '待生效' },
  initializing: { color: 'blue', text: '初始化中' },
  waitInit: { color: 'default', text: '待初始化' },
};

const mockData: ContentPoolItem[] = [
  {
    id: 1255,
    name: 'gif-帖子、资讯',
    status: 'active',
    category: '推荐',
    contentType: '帖子',
    activeCount: 5,
    pendingCount: 0,
    createTime: '2025-10-22 13:55:19',
    creator: '龚凌锋',
    operateTime: '2026-04-28 09:40:40',
    operator: '龚凌锋',
  },
  {
    id: 938,
    name: '帖子内容池条件测试-yct',
    status: 'active',
    category: '推荐',
    contentType: '帖子、资讯',
    activeCount: 1934,
    pendingCount: 0,
    createTime: '2025-08-07 13:47:29',
    creator: '杨昌太',
    operateTime: '2026-03-04 15:10:44',
    operator: '刘香',
  },
  {
    id: 912,
    name: '0801测试导入与预估',
    status: 'pending',
    category: '推荐',
    contentType: '帖子',
    activeCount: 6443,
    pendingCount: 11068,
    createTime: '2025-08-01 13:41:08',
    creator: '张家敏',
    operateTime: '2025-12-15 21:28:54',
    operator: '刘香',
  },
  {
    id: 900,
    name: '未成年推荐池',
    status: 'pending',
    category: '推荐',
    contentType: '帖子',
    activeCount: 3,
    pendingCount: 0,
    createTime: '2025-07-30 15:02:42',
    creator: '龚凌锋',
    operateTime: '2025-08-12 16:12:28',
    operator: '杨昌太',
  },
  {
    id: 788,
    name: '圈子热门帖',
    status: 'active',
    category: '推荐',
    contentType: '帖子',
    activeCount: 7961,
    pendingCount: 2,
    createTime: '2025-07-08 14:59:37',
    creator: '张金龙',
    operateTime: '2026-02-12 16:41:26',
    operator: '刘香',
  },
  {
    id: 638,
    name: '1',
    status: 'pending',
    category: '推荐',
    contentType: '帖子、资讯',
    activeCount: 15,
    pendingCount: 0,
    createTime: '2025-06-05 14:06:28',
    creator: '肖永常',
    operateTime: '2025-07-25 16:34:45',
    operator: '肖永常',
  },
];

const ContentPool: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ContentPoolItem[]>(mockData);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('查询成功');
    }, 500);
  };

  

  const handleAdd = () => {
    message.info('打开新增内容池弹窗');
  };

  const handleEdit = (record: ContentPoolItem) => {
    message.info(`编辑内容池: ${record.name}`);
  };

  const handleView = (record: ContentPoolItem) => {
    message.info(`浏览内容池: ${record.name}`);
  };

  const handleToggleStatus = (record: ContentPoolItem) => {
    const newStatus = record.status === 'active' ? 'pending' : 'active';
    const actionText = newStatus === 'active' ? '生效' : '下线';
    Modal.confirm({
      title: `确认${actionText}`,
      content: `确定要${actionText}内容池 "${record.name}" 吗？`,
      onOk: () => {
        setData((prev) =>
          prev.map((item) =>
            item.id === record.id
              ? { ...item, status: newStatus, operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), operator: '当前用户' }
              : item
          )
        );
        message.success(`${actionText}成功`);
      },
    });
  };

  const handleLog = (record: ContentPoolItem) => {
    message.info(`查看日志: ${record.name}`);
  };

  const handleCopy = (record: ContentPoolItem) => {
    message.success(`已复制内容池: ${record.name}`);
  };

  const handleTrigger = (record: ContentPoolItem) => {
    Modal.confirm({
      title: '确认手动触发',
      content: `确定要手动触发内容池 "${record.name}" 吗？`,
      onOk: () => {
        message.success('手动触发成功');
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '内容池名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => <Text style={{ color: '#eb2f96' }}>{text}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusMap[status] || statusMap.pending;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '内容类型',
      dataIndex: 'contentType',
      key: 'contentType',
      width: 120,
    },
    {
      title: '生效内容量',
      dataIndex: 'activeCount',
      key: 'activeCount',
      width: 110,
      render: (count: number) => (
        <Text style={{ color: count > 0 ? '#eb2f96' : 'inherit' }}>{count}</Text>
      ),
    },
    {
      title: '待审内容量',
      dataIndex: 'pendingCount',
      key: 'pendingCount',
      width: 110,
      render: (count: number) => (
        <Text style={{ color: count > 0 ? '#eb2f96' : 'inherit' }}>{count}</Text>
      ),
    },
    {
      title: '创建时间/创建人',
      key: 'createInfo',
      width: 160,
      render: (_: any, record: ContentPoolItem) => (
        <div style={{ textAlign: 'center' }}>
          <div>{record.createTime}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.creator}</div>
        </div>
      ),
    },
    {
      title: '操作时间/操作人',
      key: 'operateInfo',
      width: 160,
      render: (_: any, record: ContentPoolItem) => (
        <div style={{ textAlign: 'center' }}>
          <div>{record.operateTime}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.operator}</div>
        </div>
      ),
    },
    {
      title: (
        <span>
          操作
          <Tooltip title="操作说明">
            <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
          </Tooltip>
        </span>
      ),
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: ContentPoolItem) => (
        <Space size={0} split={<span style={{ color: '#e8e8e8' }}>|</span>}>
          <Button type="link" size="small" style={{ color: '#eb2f96' }} onClick={() => handleEdit(record)}>
            <EditOutlined /> 编辑
          </Button>
          <Button type="link" size="small" style={{ color: '#eb2f96' }} onClick={() => handleView(record)}>
            <EyeOutlined /> 浏览
          </Button>
          <Button
            type="link"
            size="small"
            style={{ color: '#eb2f96' }}
            onClick={() => handleToggleStatus(record)}
            icon={record.status === 'active' ? <DownOutlined /> : <UpOutlined />}
          >
            {record.status === 'active' ? '下线' : '生效'}
          </Button>
          <Button type="link" size="small" style={{ color: '#eb2f96' }} onClick={() => handleLog(record)}>
            <FileTextOutlined /> 日志
          </Button>
          <Button type="link" size="small" style={{ color: '#eb2f96' }} onClick={() => handleCopy(record)}>
            <CopyOutlined /> 复制
          </Button>
          {record.status === 'active' && (
            <Button type="link" size="small" style={{ color: '#eb2f96' }} onClick={() => handleTrigger(record)}>
              <PlayCircleOutlined /> 手动触发
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>内容管理</Breadcrumb.Item>
        <Breadcrumb.Item>内容池</Breadcrumb.Item>
        <Breadcrumb.Item>内容池列表</Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Space wrap style={{ width: '100%' }} align="start">
            <Form.Item name="id" label="ID">
              <Input placeholder="请输入ID" allowClear style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="name" label="内容池名称">
              <Input placeholder="请输入内容池名称" allowClear style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="category" label="分类">
              <Select
                placeholder="请选择分类"
                allowClear
                style={{ width: 150 }}
                defaultValue="推荐"
                options={[{ label: '推荐', value: '推荐' }]}
              />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择状态"
                allowClear
                mode="multiple"
                style={{ width: 320 }}
                defaultValue={['待生效', '待初始化', '初始化中', '生效中']}
                options={[
                  { label: '待生效', value: 'pending' },
                  { label: '待初始化', value: 'waitInit' },
                  { label: '初始化中', value: 'initializing' },
                  { label: '生效中', value: 'active' },
                ]}
              />
            </Form.Item>
            <Form.Item name="contentType" label="内容类型">
              <Select
                placeholder="请选择内容类型"
                allowClear
                style={{ width: 150 }}
                options={[
                  { label: '帖子', value: '帖子' },
                  { label: '资讯', value: '资讯' },
                  { label: '帖子、资讯', value: '帖子、资讯' },
                ]}
              />
            </Form.Item>
            <Form.Item name="operateTime" label="操作时间">
              <RangePicker placeholder={['开始日期', '结束日期']} />
            </Form.Item>
          </Space>
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: '#eb2f96', borderColor: '#eb2f96' }}>
              查询
            </Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 8, backgroundColor: '#1890ff', borderColor: '#1890ff' }} onClick={handleAdd}>
              新增内容池
            </Button>
          </div>
        </Form>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>
    </div>
  );
};

export default ContentPool;
